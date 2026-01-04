import numpy as np
from PIL import Image
import os
import cv2
import io
import re
import html  
import tensorflow as tf
from datetime import datetime
from google import genai 
import gdown 
from dotenv import load_dotenv 

# 🟢 LOAD SECRETS (Critical for Project ID)
load_dotenv() 

# --- PDF GENERATION LIBRARIES ---
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY

# --- 1. SETUP VERTEX AI (SECURE) ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = "us-central1"

# Safety Check
if not PROJECT_ID:
    print("❌ ERROR: GOOGLE_CLOUD_PROJECT missing from .env file.")
else:
    os.environ["GOOGLE_CLOUD_PROJECT"] = PROJECT_ID

try:
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    print(f"✅ SUCCESS: Connected to Vertex AI ({PROJECT_ID})")
except Exception as e:
    print(f"❌ AUTH ERROR: Vertex AI Connection Failed. {e}")

# --- 2. SETUP LOCAL MODEL ---
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
model = None
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

if not os.path.exists(MODEL_PATH):
    print(f"⚠️ Model not found at {MODEL_PATH}")
    print("⬇️ Downloading from Google Drive...")
    try:
        file_id = '1Z5xHY1KILgXEYTJv1UEhKIWjTiobuJuS'
        url = f'https://drive.google.com/uc?id={file_id}'
        gdown.download(url, MODEL_PATH, quiet=False)
        print("\n✅ Download Complete!")
    except Exception as e:
        print(f"❌ DOWNLOAD FAILED: {e}")

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"✅ SUCCESS: Model Loaded")
    else:
        print(f"❌ ERROR: Model missing.")
except Exception as e:
    print(f"❌ CRITICAL ERROR: TensorFlow failed. {e}")

# --- 3. PREDICTION ENGINE ---
def final_fix_predict_v4(img_path, model):
    if not os.path.exists(img_path):
        return None, None, "File Not Found", 0, None

    try:
        # 1. MAPPING & DIMENSIONS
        mapping = {0: 'glioma', 1: 'meningioma', 2: 'notumor', 3: 'pituitary'}
        img_size = 128

        # 2. LOAD & NORMALIZE (1./255 scaling)
        img = tf.keras.preprocessing.image.load_img(img_path, target_size=(img_size, img_size))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        
        # Scaling matching the 'augment_image' function in your notebook
        img_scaled = img_array / 255.0 
        img_expanded = np.expand_dims(img_scaled, axis=0)

        # 3. GET PREDICTION
        preds = model.predict(img_expanded, verbose=0)
        class_idx = np.argmax(preds[0])
        confidence = np.max(preds[0]) * 100
        label_name = mapping[class_idx]

        # 4. PREPARE FIGURES (RGB format)
        input_img = img_array.astype(np.uint8).copy()
        output_img = img_array.astype(np.uint8).copy() # Fresh copy for drawing
        heatmap_255 = np.zeros((img_size, img_size), dtype=np.uint8)

        # 5. LOCALIZATION
        if class_idx != 2: 
            vgg_base = model.get_layer('vgg16')
            last_conv = vgg_base.get_layer("block5_conv3")
            grad_model = tf.keras.models.Model([vgg_base.input], [last_conv.output, vgg_base.output])
            
            img_tensor = tf.Variable(tf.cast(img_expanded, tf.float32)) 
            with tf.GradientTape() as tape:
                tape.watch(img_tensor)
                conv_out, vgg_preds = grad_model(img_tensor)
                loss = vgg_preds[:, class_idx]
            
            grads = tape.gradient(loss, conv_out)[0] 
            weights = tf.reduce_mean(grads, axis=(0, 1))
            cam = conv_out[0] @ weights[..., tf.newaxis]
            cam = tf.squeeze(tf.maximum(cam, 0) / (tf.math.reduce_max(cam) + 1e-10)).numpy()
            
            # --- UPDATED BOUNDARY TRACE LOGIC ---
            heatmap_255 = np.uint8(255 * cv2.resize(cam, (img_size, img_size)))
            
            # CHANGE HERE: Replaced Otsu with a fixed high threshold (190)
            # 50-100 captures Blue/Green
            # 190+ captures Red/Yellow (The core)
            _, thresh = cv2.threshold(heatmap_255, 190, 255, cv2.THRESH_BINARY) 
            
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if contours:
                best_cnt = max(contours, key=cv2.contourArea)
                # Drawing Red Contour with thickness 2
                cv2.drawContours(output_img, [best_cnt], -1, (255, 0, 0), 2)

        return input_img, output_img, label_name, confidence, heatmap_255

    except Exception as e:
        print(f"Error: {e}")
        return None, None, "ERROR", 0, None

# --- 4. PROFESSIONAL DOCTOR AI ---
def generate_gemini_report(tumor_type, confidence, patient_data):
    try:
        print("🔵 Generating Professional AI Report...")
        
        # 🟢 OPTIMIZED PROMPT: Professional but Concise (150 words max)
        prompt = f"""
        Act as a Chief of Neuroradiology. Dictate a formal MRI Brain report.

        **PATIENT:** {patient_data.get('name')} ({patient_data.get('age')}y / {patient_data.get('gender')})
        **SYMPTOMS:** {patient_data.get('symptoms')}
        **FINDING:** {tumor_type} (Confidence: {confidence})

        **RULES:**
        1. **Tone:** Authoritative, clinical, senior specialist.
        2. **Length:** STRICTLY under 150 words. (Crucial for page fitting).
        3. **Format:** Use Markdown bolding (**text**) ONLY for section headers.

        **REQUIRED SECTIONS:**
        **CLINICAL INDICATION:** [Brief clinical summary]
        **FINDINGS:** [Concise but technical description of the {tumor_type} or normal brain. Mention key radiological features like signal intensity and mass effect.]
        **IMPRESSION:** [Definitive diagnosis.]
        **RECOMMENDATION:** [Specific next steps.]
        """
        
        # 🟢 USING YOUR REQUESTED MODEL
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt,
            config={
                "safety_settings": [
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                ]
            }
        )
        
        if not response.text:
            raise ValueError("Empty response")
            
        print(f"✅ Report Generated ({len(response.text)} chars)")
        return response.text

    except Exception as e:
        print(f"❌ GEMINI ERROR: {e}") 
        # Fallback to ensure PDF never breaks
        return f"""
        **CLINICAL INDICATION:**
        Patient presented with {patient_data.get('symptoms', 'neurological symptoms')}.
        
        **FINDINGS:**
        Automated analysis identifies imaging features consistent with {tumor_type} ({confidence}).
        Primary signals indicate specific regional abnormalities requiring detailed radiological review.
        
        **IMPRESSION:**
        Radiological evidence suggesting {tumor_type}.
        
        **RECOMMENDATION:**
        Immediate clinical correlation and neurosurgical consultation recommended.
        *(Note: AI Report unavailable, using fallback)*
        """

# --- 5. PDF GENERATOR (SMART FONT SCALING) ---
def create_pdf_in_memory(gemini_text, patient_data, img_orig, img_heat, img_cont, tumor_type, confidence):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER 
    
    # --- HEADER ---
    c.setStrokeColor(colors.darkblue)
    c.setLineWidth(3)
    c.line(30, height - 40, width - 30, height - 40)
    c.setFillColor(colors.darkblue)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(30, height - 30, "BrainWorks Medical Healthcare")
    
    # --- PATIENT INFO ---
    box_top = height - 60
    box_height = 90
    c.setStrokeColor(colors.black)
    c.setLineWidth(1)
    c.setFillColor(colors.white)
    c.rect(30, box_top - box_height, width - 60, box_height, fill=0)
    
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, box_top - 20, f"Patient: {patient_data.get('name', 'N/A')}")
    c.drawString(40, box_top - 40, f"Age / Gender: {patient_data.get('age', 'N/A')} / {patient_data.get('gender', 'N/A').capitalize()}")
    c.drawString(40, box_top - 60, f"ID: BW-{datetime.now().strftime('%m%d%H')}")
    c.drawString(300, box_top - 20, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(300, box_top - 40, "Ref: MRI Brain Scan Analysis")
    c.drawString(300, box_top - 60, "Modality: MRI Brain (Multi-planar)")

    # --- SUMMARY ---
    summary_y = box_top - box_height - 25
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.darkred if "Healthy" not in tumor_type and "No Tumor" not in tumor_type else colors.darkgreen)
    c.drawString(30, summary_y, f"DIAGNOSTIC SUMMARY: {tumor_type.upper()}")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 30, summary_y, f"AI Model Confidence: {confidence}")

    # --- IMAGES (TOP) ---
    img_y_pos = summary_y - 150 
    img_w, img_h = 130, 130
    
    def pil_to_reader(pil_img):
        img_byte_arr = io.BytesIO()
        pil_img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        return ImageReader(img_byte_arr)

    c.drawImage(pil_to_reader(img_orig), 40, img_y_pos, width=img_w, height=img_h)
    c.drawImage(pil_to_reader(img_heat), 240, img_y_pos, width=img_w, height=img_h)
    c.drawImage(pil_to_reader(img_cont), 440, img_y_pos, width=img_w, height=img_h)
    
    label_y_pos = img_y_pos - 15
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(105, label_y_pos, "Source MRI Sequence")
    c.drawCentredString(305, label_y_pos, "AI Attention Map (Grad-CAM)")
    c.drawCentredString(505, label_y_pos, "Tumor Segmentation Analysis")

    # --- REPORT BODY (BOTTOM - AUTO SCALING) ---
    frame_top_y = label_y_pos - 20 
    frame_bottom_y = 60 
    frame_height = frame_top_y - frame_bottom_y

    style_sheet = getSampleStyleSheet()
    
    # 🟢 5. SMART FONT SCALER
    text_len = len(gemini_text)
    
    # Defaults
    font_size = 10
    leading = 14
    
    # If text is huge, shrink the font so it fits
    if text_len > 1800:
        font_size = 7
        leading = 9
    elif text_len > 1500:
        font_size = 8
        leading = 10
    elif text_len > 1200:
        font_size = 9
        leading = 12

    style = ParagraphStyle(
        'ProfessionalReport',
        parent=style_sheet['Normal'],
        fontSize=font_size,
        leading=leading,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    # Formatting
    safe_text = html.escape(gemini_text)
    formatted_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', safe_text)
    formatted_text = formatted_text.replace("\n", "<br/>")
    
    p = Paragraph(formatted_text, style)
    text_frame = Frame(30, frame_bottom_y, width - 60, frame_height, showBoundary=0)
    text_frame.addFromList([p], c)
    
    # --- FOOTER ---
    c.setStrokeColor(colors.lightgrey)
    c.line(30, 50, width - 30, 50)
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(colors.grey)
    c.drawString(30, 35, "Electronically Signed by: BrainWorks System | Verified by our smartest Models.")
    
    c.save()
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data

# --- 6. ORCHESTRATOR ---
def predict_tumor(image_path, patient_data):
    if model is None:
        return {"result": "System Error", "report": "Model not loaded."}
    try:
        in_img, out_img, label, conf_val, hmap = final_fix_predict_v4(image_path, model)
        if in_img is None:
            return {"result": "Error", "error": "Processing failed"}

        display_result = "No Tumor Detected" if label == 'notumor' else "Tumor Detected"
        if label == 'notumor':
            tumor_type = "No Tumor Detected"
        else:
            tumor_type = label.capitalize()
            
        conf_str = f"{round(conf_val, 2)}%"

        detailed_report = generate_gemini_report(tumor_type, conf_str, patient_data)

        pil_orig = Image.fromarray(in_img)
        hmap_color = cv2.applyColorMap(hmap, cv2.COLORMAP_JET)
        hmap_rgb = cv2.cvtColor(hmap_color, cv2.COLOR_BGR2RGB) 
        pil_heat = Image.fromarray(hmap_rgb)
        pil_cont = Image.fromarray(out_img)

        pdf_bytes = create_pdf_in_memory(
            detailed_report, patient_data, 
            pil_orig, pil_heat, pil_cont,
            tumor_type, conf_str
        )
        
        return {
            "result": display_result,
            "type": tumor_type,
            "confidence": conf_str, 
            "report": detailed_report, 
            "pdf_bytes": pdf_bytes.hex(),
            "raw_score": str(conf_val)
        }
    except Exception as e:
        print(f"Main Error: {e}")
        return {"result": "Error", "error": str(e)}

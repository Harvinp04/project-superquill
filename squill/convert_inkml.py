import os
import cv2
import numpy as np
import xml.etree.ElementTree as ET

def parse_inkml(inkml_file):
    """Parses an InkML file and extracts stroke data."""
    tree = ET.parse(inkml_file)
    root = tree.getroot()
    
    strokes = []
    for trace in root.findall("{http://www.w3.org/2003/InkML}trace"):
        points = trace.text.strip().split(",")
        stroke = [list(map(float, point.split()))[:2] for point in points]
        strokes.append(stroke)
    
    return strokes

def inkml_to_image(inkml_file, output_path, img_size=(600, 600)):
    """Converts an InkML file to an image."""
    strokes = parse_inkml(inkml_file)
    
    if not strokes:
        print(f"Skipping {inkml_file}: No valid points found.")
        return
    
    img = np.ones(img_size, dtype=np.uint8) * 255  # White background
    
    for stroke in strokes:
        points = np.array(stroke, dtype=np.int32)
        if len(points) > 1:
            cv2.polylines(img, [points], isClosed=False, color=(0, 0, 0), thickness=2)
    
    cv2.imwrite(output_path, img)

def batch_convert_inkml(input_folder, output_folder):
    """Converts all InkML files in a directory to images."""
    os.makedirs(output_folder, exist_ok=True)
    
    for filename in os.listdir(input_folder):
        if filename.endswith(".inkml"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename.replace(".inkml", ".png"))
            inkml_to_image(input_path, output_path)
            print(f"Converted: {filename} -> {output_path}")

if __name__ == "__main__":
    input_dir = "/Users/harvin/Downloads/mathwriting-2024-excerpt/train"
    output_dir = "/Users/harvin/Documents/thresholded_images"
    batch_convert_inkml(input_dir, output_dir)

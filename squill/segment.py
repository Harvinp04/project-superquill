import cv2
import numpy as np
import os

# Define paths
input_image_path = "/Users/harvin/Documents/thresholded_images/000aa4c444cba3f2.png"
output_base_folder = "/Users/harvin/Documents/images/char_images"

# Ensure base output directory exists
os.makedirs(output_base_folder, exist_ok=True)

def segment_characters(image_path, output_base_folder, max_files_per_folder=20):
    """Segments handwritten math characters into organized folders using OpenCV."""
    
    # Load image in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"Error: Could not read {image_path}")
        return

    # Convert grayscale to BGR for visualization
    color_img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    # **Apply Adaptive Thresholding for better character separation**
    _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # **Find connected components (characters)**
    num_chars, char_labels, char_stats, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)

    char_count = 0
    folder_index = 1
    current_folder = os.path.join(output_base_folder, f"set_{folder_index}")
    os.makedirs(current_folder, exist_ok=True)

    for char_idx in range(1, num_chars):  # Skip background
        x, y, w, h, area = char_stats[char_idx]

        # **Ignore small artifacts**
        if area < 50 or w < 10 or h < 10:
            continue

        # If max files reached in folder, create a new one
        if char_count >= max_files_per_folder:
            folder_index += 1
            current_folder = os.path.join(output_base_folder, f"set_{folder_index}")
            os.makedirs(current_folder, exist_ok=True)
            char_count = 0

        # Extract character
        char_image = binary[y:y+h, x:x+w]

        # Resize to 64x64 for consistency
        char_image = cv2.resize(char_image, (64, 64), interpolation=cv2.INTER_AREA)

        # Save character image in structured folders
        char_path = os.path.join(current_folder, f"char_{char_idx}.png")
        cv2.imwrite(char_path, char_image)

        # Draw **red bounding box** around detected character
        cv2.rectangle(color_img, (x, y), (x + w, y + h), (0, 0, 255), 2)

        char_count += 1

    # **Save preview image with bounding boxes**
    preview_path = os.path.join(output_base_folder, "segmented_preview2.png")
    cv2.imwrite(preview_path, color_img)
    
    print(f"Segmented characters saved in organized sets under: {output_base_folder}")
    print(f"Preview with red bounding boxes saved at: {preview_path}")

if __name__ == "__main__":
    segment_characters(input_image_path, output_base_folder)
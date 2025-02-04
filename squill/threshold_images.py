import os
import cv2

# Define input (processed images) and output (thresholded images) directories
input_folder = "/Users/harvin/Documents/images"  # Where PNG images were saved
output_folder = "/Users/harvin/Documents/thresholded_images"  # Output folder for binarized images

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

def apply_threshold(image_path, output_path):
    """Apply adaptive thresholding to an image and save the result."""
    # Load the image directly in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        print(f"Error: Could not read {image_path}")
        return

    # Apply Adaptive Thresholding (works well for handwritten text)
    binary_img = cv2.adaptiveThreshold(
        img, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 
        11, 2
    )

    # Save the thresholded image
    cv2.imwrite(output_path, binary_img)
    print(f"Threshold applied: {image_path} -> {output_path}")

# Process all images in the input folder
for file in os.listdir(input_folder):
    if file.endswith(".png"):
        input_path = os.path.join(input_folder, file)
        output_path = os.path.join(output_folder, file)
        apply_threshold(input_path, output_path)

print("All images have been thresholded and saved.")

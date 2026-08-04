import re
import os

svg_path = r"e:\Projects-xyz\schollege-ms\frontend\public\images\15_avatars.svg"
out_dir = r"e:\Projects-xyz\schollege-ms\frontend\public\images\avatars"
os.makedirs(out_dir, exist_ok=True)

with open(svg_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract inner SVG content (excluding wrapper tags)
match = re.search(r'<svg[^>]*>(.*?)</svg>', content, re.DOTALL)
inner_svg = match.group(1) if match else content

# Remove white background rects
inner_svg = re.sub(r'<g>\s*<rect[^>]*fill:#FFFFFF[^>]*/>\s*</g>', '', inner_svg, flags=re.IGNORECASE)
inner_svg = re.sub(r'<rect[^>]*fill:#FFFFFF[^>]*/>', '', inner_svg, flags=re.IGNORECASE)
inner_svg = re.sub(r'<rect[^>]*fill="#FFFFFF"[^>]*/>', '', inner_svg, flags=re.IGNORECASE)
inner_svg = re.sub(r'<rect[^>]*width="633\.049"[^>]*/>', '', inner_svg, flags=re.IGNORECASE)

# Full cell dimensions
full_col_w = 633.049 / 5.0   # 126.6098
full_row_h = 400.0 / 3.0      # 133.3333

# Crop tighter around the character (zoom in by removing padding)
# Remove ~18% from left/right sides and ~8% top / ~10% bottom
pad_x = full_col_w * 0.14   # ~17.7 px per side
pad_top = full_row_h * 0.08  # ~10.7 px
pad_bot = full_row_h * 0.12  # ~16 px

crop_x = pad_x
crop_y = pad_top
crop_w = full_col_w - 2 * pad_x
crop_h = full_row_h - pad_top - pad_bot

for row in range(3):
    for col in range(5):
        idx = row * 5 + col + 1
        min_x = col * full_col_w + crop_x
        min_y = row * full_row_h + crop_y

        svg_file_content = f'''<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="{min_x:.3f} {min_y:.3f} {crop_w:.3f} {crop_h:.3f}" width="256" height="256">
{inner_svg}
</svg>'''

        filepath = os.path.join(out_dir, f"avatar_{idx:02d}.svg")
        with open(filepath, "w", encoding="utf-8") as out_f:
            out_f.write(svg_file_content)
        print(f"Saved avatar_{idx:02d}.svg viewBox=({min_x:.1f}, {min_y:.1f}, {crop_w:.1f}, {crop_h:.1f})")

print("Done! 15 tightly-cropped avatar SVGs saved.")

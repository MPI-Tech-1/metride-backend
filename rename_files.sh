#!/bin/bash

# A shell script to recursively rename files and directories from PascalCase to snake_case.
# Usage: ./rename_files.sh /path/to/your/folder

# Check if a directory argument was provided
if [ -z "$1" ]; then
    echo "Error: Directory path is missing."
    echo "Usage: $0 /path/to/your/folder"
    exit 1
fi

# Resolve the absolute path and check if it's a valid directory
ROOT_DIR="$(realpath "$1")"

if [ ! -d "$ROOT_DIR" ]; then
    echo "Error: The path '$1' is not a valid directory."
    exit 1
fi

echo "--- Starting PascalCase to snake_case rename operation in directory: $ROOT_DIR ---"

# --- Function to apply the renaming logic (PascalCase to snake_case) ---
# This function converts a name from PascalCase (e.g., MyFileName.ext) 
# to snake_case (e.g., my_file_name.ext).
#
# Logic:
# 1. Use sed to insert an underscore before any uppercase letter (A-Z) 
#    that is NOT at the start of the string.
# 2. Use tr to convert the entire string to lowercase.
# 3. Use sed again to remove any leading or trailing underscores that may result.
clean_name() {
    local original_name="$1"
    
    local cleaned_name=$(echo "$original_name" | \
        # 1. Insert '_' before an uppercase letter that is not the first character
        sed -r 's/([a-z0-9])([A-Z])/\1_\2/g' | \
        # 2. Convert to lowercase
        tr '[:upper:]' '[:lower:]' | \
        # 3. Remove any leading/trailing underscores (optional cleanup)
        sed -r 's/^_//; s/_$//')

    echo "$cleaned_name"
}

# --- Step 1: Rename directories (Bottom-Up Traversal) ---
# We use 'find -depth' to ensure the deepest directories are renamed first.
echo ""
echo "[STEP 1/2] Processing Folders (PascalCase -> snake_case)..."

find "$ROOT_DIR" -depth -type d | while IFS= read -r old_dirpath; do
    # Skip the root directory itself
    if [ "$old_dirpath" == "$ROOT_DIR" ]; then
        continue
    fi
    
    # Extract the current directory name and parent path
    old_dir_name=$(basename "$old_dirpath")
    parent_dir=$(dirname "$old_dirpath")
    
    # Get the new cleaned name
    new_dir_name=$(clean_name "$old_dir_name")
    
    if [ "$old_dir_name" != "$new_dir_name" ]; then
        new_dirpath="$parent_dir/$new_dir_name"
        
        # Rename the directory
        # The 2>/dev/null suppresses common errors like "No such file or directory" 
        # which can sometimes happen with deeply nested directories being moved, 
        # though this structure minimizes that risk.
        if mv "$old_dirpath" "$new_dirpath" 2>/dev/null; then
            echo "    Folder Renamed: '$old_dir_name' -> '$new_dir_name'"
        else
            echo "    Error renaming folder $old_dirpath" 1>&2
        fi
    fi
done

# --- Step 2: Rename files (Top-Down Traversal) ---
# Find all files recursively. The paths found here will reflect the directory renames from Step 1.
echo ""
echo "[STEP 2/2] Processing Files (PascalCase -> snake_case)..."

find "$ROOT_DIR" -type f | while IFS= read -r old_filepath; do
    # Extract the filename and directory path
    old_filename=$(basename "$old_filepath")
    dirpath=$(dirname "$old_filepath")
    
    # Get the new cleaned name
    # The clean_name function handles the extension automatically by converting everything
    # to lowercase and inserting underscores, which is generally acceptable for this case style.
    new_filename=$(clean_name "$old_filename")
    
    if [ "$old_filename" != "$new_filename" ]; then
        # Construct the new path
        new_filepath="$dirpath/$new_filename"
        
        # Rename the file
        if mv "$old_filepath" "$new_filepath" 2>/dev/null; then
            echo "    File Renamed: '$old_filename' -> '$new_filename'"
        else
            echo "    Error renaming file $old_filepath" 1>&2
        fi
    fi
done

echo ""
echo "--- Rename operation complete. ---"
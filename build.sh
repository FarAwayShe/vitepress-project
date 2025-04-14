#!/bin/bash

# 创建目标目录
mkdir -p public/images

# 处理所有 .md 文件中的图片
process_md_images() {
  # 查找所有的 .md 文件
  find . -type f -name "*.md" | while read -r md_file; do
    echo "处理文件: $md_file"
    
    # 临时文件
    temp_file=$(mktemp)
    
    # 使用 grep 提取所有图片引用，然后处理每个引用
    grep -o '!\[[^]]*\]([^)]*)' "$md_file" | while read -r img_ref; do
      # 从图片引用中提取路径部分
      img_path=$(echo "$img_ref" | sed -E 's/!\[[^]]*\]\(([^)]*)\)/\1/')
      img_path_clean="${img_path%% *}" # 移除可能的尾部属性
      
      # 判断是本地图片还是网络图片
      if [[ "$img_path_clean" =~ ^https?:// ]]; then
        # 网络图片
        img_filename=$(basename "$img_path_clean")
        # 生成唯一文件名防止冲突
        unique_filename="$(date +%s%N)_${img_filename}"
        echo "下载网络图片: $img_path_clean 到 public/images/$unique_filename"
        
        # 下载图片到目标目录
        curl -s "$img_path_clean" -o "public/images/$unique_filename" || wget -q "$img_path_clean" -O "public/images/$unique_filename"
        
        # 替换原文件中的图片路径
        sed -i "s|$img_path|/images/$unique_filename|g" "$md_file"
      elif [[ -f "${img_path_clean#./}" ]]; then
        # 本地图片 (相对路径)
        img_filename=$(basename "$img_path_clean")
        # 生成唯一文件名防止冲突
        unique_filename="$(date +%s%N)_${img_filename}"
        echo "复制本地图片: $img_path_clean 到 public/images/$unique_filename"
        
        # 复制图片到目标目录
        cp "${img_path_clean#./}" "public/images/$unique_filename"
        
        # 替换原文件中的图片路径
        sed -i "s|$img_path|/images/$unique_filename|g" "$md_file"
      elif [[ -f "$img_path_clean" ]]; then
        # 本地图片 (绝对路径)
        img_filename=$(basename "$img_path_clean")
        # 生成唯一文件名防止冲突
        unique_filename="$(date +%s%N)_${img_filename}"
        echo "复制本地图片: $img_path_clean 到 public/images/$unique_filename"
        
        # 复制图片到目标目录
        cp "$img_path_clean" "public/images/$unique_filename"
        
        # 替换原文件中的图片路径
        sed -i "s|$img_path|/images/$unique_filename|g" "$md_file"
      else
        echo "警告: 无法找到图片 $img_path_clean"
      fi
    done
  done
  
  echo "所有 Markdown 文件的图片资源已处理完成"
}

# 运行函数
process_md_images
import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 实例化一个观察者
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当元素进入可视区域时
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // 触发加载后，立刻断开观察，节省性能
        }
      },
      { 
        rootMargin: '100px', // 核心细节：提前 100px 开始加载，让用户感觉不到延迟
      } 
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect(); // 组件卸载时清理
  }, []);

  return (
    <img
      ref={imgRef}
      // 如果进入了可视区域，赋予真实的 src；否则给一个透明的 1x1 像素 base64 占位图
      src={isIntersecting ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      style={{
        // 配合 onLoad 实现优雅的淡入动画效果
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#f5f5f5', // 图片未加载出来前，显示浅灰色骨架背景
        objectFit: 'cover',
      }}
    />
  );
};

export default LazyImage;
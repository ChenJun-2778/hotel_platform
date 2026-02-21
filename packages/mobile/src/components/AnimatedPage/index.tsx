import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

// 定义动画效果：这里写的是简单的“淡入 + 轻微上浮”
const animations = {
  initial: { opacity: 0, y: 20 }, // 进场前：透明，向下偏移 20px
  animate: { opacity: 1, y: 0 },  // 进场后：完全显示，归位
  exit: { opacity: 0, y: -20 },   // 离场时：变透明，向上飘走
};

const AnimatedPage: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }} // 动画时长 0.3秒
      style={{ width: '100%', height: '100%' }} // 撑满容器
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
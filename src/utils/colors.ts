export const getBiasColor = (bias: string, opacity: number = 1) => {
  const baseColors = {
    left: '0, 0, 255',  // Blue
    center: '128, 128, 128',  // Gray
    right: '255, 0, 0',  // Red
  };

  const baseColor = baseColors[bias as keyof typeof baseColors] || baseColors.center;
  return `rgba(${baseColor}, ${opacity})`;
};

export const getBiasBackgroundColor = (bias: string) => {
  switch (bias) {
    case 'left':
      return getBiasColor('left', 0.15);
    case 'center':
      return getBiasColor('center', 0.1);
    case 'right':
      return getBiasColor('right', 0.15);
    default:
      return 'transparent';
  }
}; 
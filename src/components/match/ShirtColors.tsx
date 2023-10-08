type ShirtColorsProps = { colors: string[] };

export const ShirtColors = ({ colors }: ShirtColorsProps) => {
  return (
    <svg viewBox="0 0 34 34" width="1.2em" height="1.2em">
      <mask id="shirt-mask">
        <circle cx="17" cy="17" r="16" fill="white" />
      </mask>
      <g mask="url(#shirt-mask)">
        {colors.map((color, i) => {
          const colorWidth = Math.round(32 / colors.length);

          return (
            <rect
              key={color + i.toString()}
              x={1 + colorWidth * i}
              y={1}
              height={32}
              width={colorWidth}
              fill={color}
            />
          );
        })}
      </g>
      <circle
        cx="17"
        cy="17"
        r="16"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
};

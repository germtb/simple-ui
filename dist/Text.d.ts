import { ReactNode } from "react";
import { TextColor, Size } from "./Palette";
export interface TextProps {
    children: ReactNode;
    color?: TextColor;
    size?: Size;
    ellipsis?: boolean | "default";
    align?: "center" | "none";
    display?: "inline" | "block";
    grow?: boolean;
}
export declare function Text({ children, color, size, align, ellipsis, display, grow, }: TextProps): JSX.Element;

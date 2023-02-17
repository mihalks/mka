// Copyright (c) 2021 Ivan Teplov

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

/**
 * Colors that are available in the app
 */
export const brushColors = {
    Substance: '#000',
    Barrier: '#dd2a2a',
    Absorber: '#129d12',
    Source: '#2875d5',
}

export function getColor(colorName: string): string {
    return (brushColors as any)[colorName]
}

interface BrushColorButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    brushColor: string
}

/**
 * Button to choose a specific color
 */
export function BrushColorButton({
    brushColor: color,
    className,
    ...props
}: BrushColorButtonProps) {
    return (
        <button
            type="button"
            title={color} //имя и цвет
            className={'BrushColorButton ' + (className ?? '')}
            {...props}
        >
            {/* Square filled with the color */}
            <span style={{ backgroundColor: getColor(color) }} />
        </button>
    )
}

export default BrushColorButton

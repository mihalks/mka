// Copyright (c) 2021 Ivan Teplov

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

/**
 * Colors that are available in the app
 */
export const brushColors = {
    "Substance": '#000',
    "Barrier": '#dd2a2a',
    "Absorber": '#129d12',
    "Source": '#2875d5',
}

export type Color = {
    color: string
    title: string
}

export const brushName = {
    Substance:"Вещество",
    Barrier:"Barrier",
    Absorber:"Поглотитель",
    Source:"Источник"
}

const getColor = (colorName: string): string => {
    return (brushName as any)[colorName]
}

interface BrushColorButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    brushColor: Color
}

/**
 * Button to choose a specific color
 */
export function BrushColorButton({
    brushColor: item,
    className,
    ...props
}: BrushColorButtonProps) {
    return (
        <button
            type="button"
            title={item.title} //имя и цвет и функция?
            className={'BrushColorButton ' + (className ?? '')}
            {...props}
        >
            {/* Square filled with the color */}
            <span style={{ backgroundColor: item.color }} />
        </button>
    )
}

export default BrushColorButton

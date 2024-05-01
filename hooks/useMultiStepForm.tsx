import { ReactElement, useState } from "react";

export function useMultiStepForm(steps: string[]) {
    const [currentStep, setCurrentStep] = useState(0)

    function next() {
        setCurrentStep(i => {
            if (i >= steps.length - 1) return i
            return i + 1
        })
    }

    function back() {
        setCurrentStep(i => {
            if (i <= 0) return i
            return i - 1
        })
    }

    function goto(index: number) {
        setCurrentStep(index)
    }

    return {
        currentStep,
        currentEl: steps[currentStep],
        goto,
        next,
        back,
        elements: steps
    }
}
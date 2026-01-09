import { jsPDF } from "jspdf"

interface PDFHeader {
  userName: string
  title: string
  date: string
  theme: { primary: string; secondary: string }
}

export class FitnessPDFGenerator {
  private doc: jsPDF
  private yPos = 20
  private pageHeight = 280
  private margin = 15

  constructor() {
    this.doc = new jsPDF()
  }

  private checkPageBreak(height = 10) {
    if (this.yPos + height > this.pageHeight) {
      this.doc.addPage()
      this.yPos = 20
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 59, g: 130, b: 246 }
  }

  private addHeader(header: PDFHeader) {
    const rgb = this.hexToRgb(header.theme.primary)

    this.doc.setFillColor(rgb.r, rgb.g, rgb.b)
    this.doc.rect(0, 0, 210, 20, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(18)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("FitTransform", this.margin, 12)

    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(header.date, 195, 12, { align: "right" })

    this.yPos = 28

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(13)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(`Plano de ${header.title}`, this.margin, this.yPos)

    this.yPos += 6
    this.doc.setFontSize(9)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(`Preparado para: ${header.userName}`, this.margin, this.yPos)

    this.yPos += 10
  }

  generateCalisthenicsWorkoutPDF(
    userName: string,
    workouts: any[],
    theme: { primary: string; secondary: string },
  ): Blob {
    this.addHeader({
      userName,
      title: "Treino em Casa",
      date: new Date().toLocaleDateString("pt-BR"),
      theme,
    })

    workouts.forEach((workout, index) => {
      this.checkPageBreak(25)

      const rgb = this.hexToRgb(theme.primary)

      this.doc.setFillColor(rgb.r, rgb.g, rgb.b)
      this.doc.rect(this.margin, this.yPos - 3, 180, 8, "F")
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFontSize(11)
      this.doc.setFont("helvetica", "bold")
      this.doc.text(`${workout.day} - ${workout.name}`, this.margin + 2, this.yPos + 2)

      this.yPos += 10
      this.doc.setTextColor(0, 0, 0)
      this.doc.setFontSize(8)
      this.doc.setFont("helvetica", "normal")

      this.doc.text(`Duracao: ${workout.duration}`, this.margin + 2, this.yPos)
      this.yPos += 5

      if (workout.focus && workout.focus.length > 0) {
        this.doc.text(`Foco: ${workout.focus.join(", ")}`, this.margin + 2, this.yPos)
        this.yPos += 6
      }

      this.doc.setFont("helvetica", "bold")
      this.doc.setFontSize(9)
      this.doc.text("Exercicios:", this.margin + 2, this.yPos)
      this.yPos += 5
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(8)

      workout.exercises.forEach((exercise: any) => {
        this.checkPageBreak(6)
        const exerciseText = `- ${exercise.name} - ${exercise.sets}`
        this.doc.text(exerciseText, this.margin + 4, this.yPos)
        this.yPos += 4
      })

      this.yPos += 4
    })

    return this.doc.output("blob")
  }

  generateNutritionPDF(
    userName: string,
    meals: any[],
    totalCalories: number,
    theme: { primary: string; secondary: string },
  ): Blob {
    this.addHeader({
      userName,
      title: "Nutricao",
      date: new Date().toLocaleDateString("pt-BR"),
      theme,
    })

    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(this.margin, this.yPos, 180, 10, "F")
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(`Total Diario: ${totalCalories} kcal`, this.margin + 5, this.yPos + 6)

    this.yPos += 16

    meals.forEach((meal) => {
      this.checkPageBreak(20)

      const rgb = this.hexToRgb(theme.primary)

      this.doc.setFillColor(rgb.r, rgb.g, rgb.b)
      this.doc.rect(this.margin, this.yPos - 3, 180, 7, "F")
      this.doc.setTextColor(255, 255, 255)
      this.doc.setFontSize(10)
      this.doc.setFont("helvetica", "bold")
      this.doc.text(`${meal.time} - ${meal.name}`, this.margin + 2, this.yPos + 2)

      this.yPos += 9
      this.doc.setTextColor(0, 0, 0)
      this.doc.setFontSize(8)
      this.doc.setFont("helvetica", "italic")
      this.doc.text(`${meal.calories} kcal`, this.margin + 2, this.yPos)
      this.yPos += 5

      this.doc.setFont("helvetica", "normal")
      meal.foods.forEach((food: string) => {
        this.checkPageBreak(5)
        this.doc.text(`- ${food}`, this.margin + 4, this.yPos)
        this.yPos += 4
      })

      this.yPos += 4
    })

    return this.doc.output("blob")
  }

  generateGymWorkoutPDF(
    userName: string,
    workout: {
      name: string
      focus: string
      muscleGroups: string[]
      exercises: Array<{ name: string; sets: string; notes: string }>
    },
    theme: { primary: string; secondary: string },
  ): Blob {
    this.addHeader({
      userName,
      title: `Musculacao - ${workout.name}`,
      date: new Date().toLocaleDateString("pt-BR"),
      theme,
    })

    const rgb = this.hexToRgb(theme.primary)

    this.doc.setFillColor(rgb.r, rgb.g, rgb.b)
    this.doc.rect(this.margin, this.yPos - 3, 180, 10, "F")
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(13)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(workout.name, this.margin + 2, this.yPos + 3)

    this.yPos += 12
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(9)
    this.doc.setFont("helvetica", "italic")
    this.doc.text(`Foco: ${workout.focus}`, this.margin + 2, this.yPos)
    this.yPos += 6

    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(`Grupos Musculares: ${workout.muscleGroups.join(", ")}`, this.margin + 2, this.yPos)
    this.yPos += 10

    this.doc.setFontSize(11)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Exercicios:", this.margin, this.yPos)
    this.yPos += 7

    workout.exercises.forEach((exercise, index) => {
      this.checkPageBreak(20)

      this.doc.setFillColor(245, 245, 245)
      this.doc.rect(this.margin, this.yPos - 2, 180, 6, "F")
      this.doc.setFontSize(9)
      this.doc.setFont("helvetica", "bold")
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(`${index + 1}. ${exercise.name}`, this.margin + 2, this.yPos + 2)

      this.yPos += 8

      const rgbSecondary = this.hexToRgb(theme.secondary)
      this.doc.setFontSize(8)
      this.doc.setTextColor(rgbSecondary.r, rgbSecondary.g, rgbSecondary.b)
      this.doc.setFont("helvetica", "bold")
      this.doc.text(`Series: ${exercise.sets}`, this.margin + 4, this.yPos)

      this.yPos += 5

      if (exercise.notes) {
        this.doc.setTextColor(100, 100, 100)
        this.doc.setFont("helvetica", "italic")
        this.doc.setFontSize(7)
        const notesLines = this.doc.splitTextToSize(`Dica: ${exercise.notes}`, 170)
        notesLines.forEach((line: string) => {
          this.checkPageBreak(4)
          this.doc.text(line, this.margin + 4, this.yPos)
          this.yPos += 4
        })
      }

      this.yPos += 4
      this.doc.setTextColor(0, 0, 0)
    })

    return this.doc.output("blob")
  }

  generateSupplementsPDF(userName: string, supplements: any[], theme: { primary: string; secondary: string }): Blob {
    this.addHeader({
      userName,
      title: "Suplementos",
      date: new Date().toLocaleDateString("pt-BR"),
      theme,
    })

    this.doc.setFontSize(9)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Protocolo de suplementacao recomendado:", this.margin, this.yPos)
    this.yPos += 8

    supplements.forEach((supplement) => {
      this.checkPageBreak(12)

      this.doc.setFontSize(10)
      this.doc.setFont("helvetica", "bold")
      this.doc.text(`- ${supplement.name}`, this.margin + 2, this.yPos)
      this.yPos += 5

      this.doc.setFontSize(8)
      this.doc.setFont("helvetica", "normal")
      this.doc.text(`  Dosagem: ${supplement.dosage}`, this.margin + 5, this.yPos)
      this.yPos += 4
      this.doc.text(`  Horario: ${supplement.time}`, this.margin + 5, this.yPos)
      this.yPos += 6
    })

    return this.doc.output("blob")
  }
}

export async function sharePDF(blob: Blob, fileName: string) {
  const file = new File([blob], fileName, { type: "application/pdf" })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: fileName,
        text: "Confira meu plano de treino do FitTransform!",
      })
      return true
    } catch (error) {
      console.error("Error sharing:", error)
      return false
    }
  } else {
    // Fallback: download
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    return true
  }
}

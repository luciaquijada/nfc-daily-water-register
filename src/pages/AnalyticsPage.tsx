import { ChartColumn } from 'lucide-react'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'

export function AnalyticsPage() {
  return (
    <PagePlaceholder
      title="Análisis"
      description="Aquí encontrarás patrones y conclusiones sobre tus hábitos. Disponible en una próxima fase."
      icon={ChartColumn}
    />
  )
}

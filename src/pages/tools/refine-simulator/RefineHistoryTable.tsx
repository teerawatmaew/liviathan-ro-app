import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SimAttempt } from './RefineSimulatorPage'

interface Props {
  attempts: SimAttempt[]
}

export default function RefineHistoryTable({ attempts }: Props) {
  const displayAttempts = attempts.slice(0, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          ประวัติการตีบวก
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            (แสดง {displayAttempts.length} จาก {attempts.length} ครั้งล่าสุด)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-card">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  จาก
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  โอกาส
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  ผลลัพธ์
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  เป็น
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  แร่ที่ใช้
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                  BSB
                </th>
              </tr>
            </thead>
            <tbody>
              {displayAttempts.map((a) => (
                <tr
                  key={a.id}
                  className={cn(
                    'border-b transition-colors',
                    a.broke
                      ? 'bg-red-500/5'
                      : a.success
                        ? 'bg-green-500/5'
                        : 'bg-orange-500/5',
                  )}
                >
                  <td className="px-3 py-1.5 text-xs text-muted-foreground tabular-nums">
                    {a.id}
                  </td>
                  <td className="px-3 py-1.5 text-center font-medium tabular-nums">
                    +{a.fromLevel}
                  </td>
                  <td className="px-3 py-1.5 text-center text-xs text-muted-foreground tabular-nums">
                    {a.successRate}%
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    {a.broke ? (
                      <Badge variant="destructive" className="text-xs py-0 h-5">
                        เสียหาย
                      </Badge>
                    ) : a.success ? (
                      <Badge className="text-xs py-0 h-5 bg-green-600 hover:bg-green-700">
                        สำเร็จ
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs py-0 h-5 text-orange-400 border-orange-400/40"
                      >
                        ล้มเหลว
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-center font-medium tabular-nums">
                    {a.broke ? (
                      <span className="text-red-400">💥</span>
                    ) : (
                      <span
                        className={cn(
                          a.toLevel > a.fromLevel
                            ? 'text-green-400'
                            : a.toLevel < a.fromLevel
                              ? 'text-red-400'
                              : 'text-muted-foreground',
                        )}
                      >
                        +{a.toLevel}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-center text-xs text-muted-foreground whitespace-nowrap">
                    {a.oreName}
                  </td>
                  <td className="px-3 py-1.5 text-center text-xs tabular-nums">
                    {a.bsbUsed > 0 ? (
                      <span className="text-amber-400 font-medium">{a.bsbUsed}</span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

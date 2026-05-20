import { changelog } from '@/data/changelog'
import { usePageTitle } from '@/hooks/use-page-title'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const typeLabel: Record<string, string> = {
  feat: 'ใหม่',
  fix: 'แก้ไข',
  improve: 'ปรับปรุง',
}

const typeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  feat: 'default',
  fix: 'secondary',
  improve: 'outline',
}

export default function ChangelogPage() {
  usePageTitle('Changelog')

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Changelog</h1>
        <p className="text-muted-foreground text-sm mt-1">
          บันทึกการเปลี่ยนแปลงและฟีเจอร์ใหม่ของ LiviathaN RO
        </p>
      </div>

      <div className="space-y-8">
        {changelog.map((entry, i) => (
          <div key={entry.version}>
            {i > 0 && <Separator className="mb-8" />}
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-lg font-bold font-mono">v{entry.version}</h2>
              <span className="text-xs text-muted-foreground">{entry.date}</span>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm">
                  <Badge
                    variant={typeVariant[change.type]}
                    className="mt-0.5 shrink-0 text-[10px] px-1.5 py-0"
                  >
                    {typeLabel[change.type]}
                  </Badge>
                  <span>{change.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

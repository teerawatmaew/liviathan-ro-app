import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

import { PATHS } from '@/routes/paths'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  gender: string
  address: string
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: '',
}

export default function FormPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleReset() {
    setForm(initialForm)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-lg space-y-4">

        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link to={PATHS.HOME}>← กลับหน้าหลัก</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">ข้อมูลเบื้องต้น</CardTitle>
            <CardDescription>กรุณากรอกข้อมูลของคุณให้ครบถ้วน</CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="flex flex-col items-center text-center gap-4 py-10">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-base">บันทึกข้อมูลสำเร็จ</p>
                <p className="text-sm text-muted-foreground">
                  ขอบคุณที่กรอกข้อมูล{' '}
                  <span className="font-medium text-foreground">
                    {form.firstName} {form.lastName}
                  </span>
                </p>
              </div>
              <Button variant="outline" onClick={handleReset} className="mt-2">
                กรอกข้อมูลใหม่
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-4">

                {/* ชื่อ – นามสกุล */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">
                      ชื่อ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="ชื่อจริง"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">
                      นามสกุล <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="นามสกุล"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      autoComplete="family-name"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* อีเมล */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    อีเมล <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full"
                  />
                </div>

                {/* เบอร์โทร – วันเกิด */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0xx-xxx-xxxx"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate">วันเกิด</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* เพศ */}
                <div className="space-y-1.5">
                  <Label htmlFor="gender">เพศ</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, gender: val }))}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="-- เลือกเพศ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ชาย</SelectItem>
                      <SelectItem value="female">หญิง</SelectItem>
                      <SelectItem value="other">อื่น ๆ</SelectItem>
                      <SelectItem value="prefer_not">ไม่ระบุ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ที่อยู่ */}
                <div className="space-y-1.5">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="บ้านเลขที่ ถนน ตำบล/แขวง อำเภอ/เขต จังหวัด รหัสไปรษณีย์"
                    value={form.address}
                    onChange={handleChange}
                    className="resize-y min-h-[88px]"
                  />
                </div>

              </CardContent>

              <CardFooter className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}>
                  ล้างข้อมูล
                </Button>
                <Button type="submit">
                  บันทึกข้อมูล
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

      </div>
    </div>
  )
}


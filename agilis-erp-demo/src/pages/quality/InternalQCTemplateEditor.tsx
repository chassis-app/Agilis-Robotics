import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { Eye, LayoutTemplate, Plus, Printer, Save, WandSparkles } from 'lucide-react'

const blockLibrary = [
  { id: 'cover', zh: '封面区块', en: 'Cover Block' },
  { id: 'aql', zh: 'AQL 抽样区块', en: 'AQL Sample Block' },
  { id: 'visual', zh: '外观检查区块', en: 'Visual Check Block' },
  { id: 'functional', zh: '功能检查区块', en: 'Functional Check Block' },
  { id: 'signoff', zh: '签核区块', en: 'Sign-off Block' },
]

export default function InternalQCTemplateEditor() {
  const { t } = useTranslation()
  const { language } = useAuthStore()
  const [selectedTemplate, setSelectedTemplate] = useState('EU Category-A Final Assembly')

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {language === 'zh-CN' ? '内部检验模板编辑器' : 'Internal QC Template Editor'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {language === 'zh-CN'
              ? '所见即所得编辑器，用于维护固定版式、可打印的 QC 表单模板'
              : 'WYSIWYG editor for fixed-layout, printable QC form templates.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Eye className="h-4 w-4" />
            {language === 'zh-CN' ? '打印预览' : 'Print Preview'}
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4" />
            {t('common.save')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px,1fr,320px]">
        <Card className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {language === 'zh-CN' ? '模板列表' : 'Templates'}
            </h3>
            <div className="mt-3 space-y-2">
              {['EU Category-A Final Assembly', 'CN Category-B Semi Product', 'US Category-C Final Packout'].map((template) => (
                <button
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selectedTemplate === template
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">
                {language === 'zh-CN' ? '区块库' : 'Block Library'}
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {blockLibrary.map((block) => (
                <div key={block.id} className="rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-700">
                  {language === 'zh-CN' ? block.zh : block.en}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="min-h-[680px] bg-neutral-100">
          <div className="mx-auto max-w-[720px] rounded-[24px] bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Template</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900">{selectedTemplate}</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {language === 'zh-CN' ? '适用市场 / 分类 / Build Order 条件将自动注入表头' : 'Market, category, and build-order conditions are injected automatically.'}
                </p>
              </div>
              <LayoutTemplate className="h-6 w-6 text-neutral-400" />
            </div>

            <div className="space-y-5 py-6">
              <section className="rounded-2xl border border-neutral-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900">{language === 'zh-CN' ? '封面与批次信息' : 'Cover & Batch Information'}</h3>
                  <span className="text-xs text-neutral-400">{language === 'zh-CN' ? '静态打印区块' : 'Fixed Print Block'}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {['Build Order', 'Production Batch', 'Market', 'Category A/B/C'].map((label) => (
                    <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">{label}</div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900">{language === 'zh-CN' ? 'AQL 抽检参数' : 'AQL Sampling Parameters'}</h3>
                  <WandSparkles className="h-4 w-4 text-primary-500" />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {['Lot Size', 'Inspection Level', 'Sample Qty'].map((label) => (
                    <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">{label}</div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">{language === 'zh-CN' ? '检查项目' : 'Checklist Items'}</h3>
                <div className="space-y-2">
                  {[
                    language === 'zh-CN' ? '外观完整性' : 'Visual Integrity',
                    language === 'zh-CN' ? '功能动作检查' : 'Functional Motion Check',
                    language === 'zh-CN' ? '标签与市场要求' : 'Label & Market Compliance',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-500">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">{language === 'zh-CN' ? '签核栏' : 'Sign-off'}</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {['Inspector', 'Reviewer', 'Release'].map((label) => (
                    <div key={label} className="rounded-lg border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-500">
                      {label}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {language === 'zh-CN' ? '属性面板' : 'Properties'}
            </h3>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '模板名称' : 'Template Name'}</label>
                <input
                  value={selectedTemplate}
                  onChange={() => {}}
                  className="mt-1 h-9 w-full rounded-md border border-neutral-300 px-3"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '适用市场' : 'Markets'}</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {['CN', 'EU', 'US'].map((market) => (
                    <span key={market} className="rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">{market}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-500">{language === 'zh-CN' ? '分类字段映射' : 'Category Mapping'}</label>
                <div className="mt-2 space-y-2">
                  {['Category A', 'Category B', 'Category C'].map((item) => (
                    <div key={item} className="rounded-lg bg-neutral-50 px-3 py-2 text-neutral-700">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <Button variant="secondary" size="sm" className="w-full justify-center">
              <Printer className="h-4 w-4" />
              {language === 'zh-CN' ? '生成可打印 PDF' : 'Generate Printable PDF'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

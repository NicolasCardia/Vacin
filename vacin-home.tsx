'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MapPin, Syringe, ArrowLeft, MessageCircle } from 'lucide-react'

type Vaccine = {
  id: string
  name: string
  fullPrice: number
  discountPrice: number
  description: string
}

const availableVaccines: Vaccine[] = [
  {
    id: 'gripe',
    name: 'Vacina contra Gripe',
    fullPrice: 50,
    discountPrice: 40,
    description: 'Previne contra os vírus da gripe sazonal.'
  },
  {
    id: 'triplice',
    name: 'Tríplice Viral',
    fullPrice: 80,
    discountPrice: 65,
    description: 'Protege contra sarampo, caxumba e rubéola.'
  },
  {
    id: 'herpes',
    name: 'Vacina contra Herpes Zoster',
    fullPrice: 200,
    discountPrice: 160,
    description: 'Previne o herpes zoster e suas complicações.'
  },
  {
    id: 'dengue',
    name: 'Vacina contra Dengue',
    fullPrice: 180,
    discountPrice: 150,
    description: 'Oferece proteção contra os quatro sorotipos do vírus da dengue.'
  }
]

export default function VacinHome() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    vaccines: [{ name: '', date: '' }]
  })
  const [selectedVaccines, setSelectedVaccines] = useState<Vaccine[]>([])
  const [token, setToken] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    if (step === 4 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [step, timeLeft])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }))
  }

  const handleVaccineChange = (index: number, field: string, value: string) => {
    const newVaccines = [...formData.vaccines]
    newVaccines[index] = { ...newVaccines[index], [field]: value }
    setFormData(prev => ({ ...prev, vaccines: newVaccines }))
  }

  const addVaccine = () => {
    setFormData(prev => ({
      ...prev,
      vaccines: [...prev.vaccines, { name: '', date: '' }]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const toggleVaccineSelection = (vaccine: Vaccine) => {
    setSelectedVaccines(prev => {
      const isSelected = prev.some(v => v.id === vaccine.id)
      if (isSelected) {
        return prev.filter(v => v.id !== vaccine.id)
      } else {
        return [...prev, vaccine]
      }
    })
  }

  const proceedToFinalStep = () => {
    if (selectedVaccines.length > 0) {
      setStep(3)
      setToken(Math.random().toString(36).substr(2, 8).toUpperCase())
    }
  }

  const getTotalPrice = () => {
    return selectedVaccines.reduce((total, vaccine) => total + vaccine.discountPrice, 0)
  }

  const goBack = () => {
    setStep(prev => prev - 1)
  }

  const confirmAndSchedule = () => {
    setStep(4)
    setTimeLeft(300) // Reset timer to 5 minutes
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{step === 4 ? 'Vacin - Home' : 'Formulário de Vacinação'}</CardTitle>
        <CardDescription>
          {step === 4 ? 'Seu token e informações de agendamento' : 'Preencha suas informações e escolha suas vacinas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
            </div>
            <div>
              <Label>Sexo</Label>
              <RadioGroup value={formData.gender} onValueChange={handleGenderChange} required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="masculino"/>
                  <Label htmlFor="masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminino" id="feminino"/>
                  <Label htmlFor="feminino">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outros" id="outros"/>
                  <Label htmlFor="outros">Outros</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Vacinas já tomadas (opcional)</Label>
              {formData.vaccines.map((vaccine, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Nome da vacina"
                    value={vaccine.name}
                    onChange={(e) => handleVaccineChange(index, 'name', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={vaccine.date}
                    onChange={(e) => handleVaccineChange(index, 'date', e.target.value)}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" className="mt-2" onClick={addVaccine}>
                Adicionar outra vacina
              </Button>
            </div>
            <Button type="submit">Próximo</Button>
          </form>
        )}
        {step === 2 && (
          <>
            <Accordion type="single" collapsible className="w-full mb-4">
              {availableVaccines.map((vaccine) => (
                <AccordionItem value={vaccine.id} key={vaccine.id}>
                  <AccordionTrigger>{vaccine.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`select-${vaccine.id}`}
                        checked={selectedVaccines.some(v => v.id === vaccine.id)}
                        onCheckedChange={() => toggleVaccineSelection(vaccine)}
                      />
                      <Label htmlFor={`select-${vaccine.id}`}>Selecionar esta vacina</Label>
                    </div>
                    <p>{vaccine.description}</p>
                    <p className="mt-2">
                      <span className="line-through">Preço: R$ {vaccine.fullPrice.toFixed(2)}</span>
                      <span className="ml-2 font-bold text-green-600">
                        Preço com desconto: R$ {vaccine.discountPrice.toFixed(2)}
                      </span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                <span className="font-semibold text-lg">Total:</span>
                <span className="text-2xl font-bold">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={goBack} variant="outline" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <Button onClick={proceedToFinalStep} disabled={selectedVaccines.length === 0}>
                  Finalizar seleção
                </Button>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vacinas selecionadas:</h3>
            <ul className="list-disc list-inside">
              {selectedVaccines.map(vaccine => (
                <li key={vaccine.id} className="flex items-center">
                  <Syringe className="mr-2 h-4 w-4" />
                  {vaccine.name} - R$ {vaccine.discountPrice.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-bold">Total a pagar: R$ {getTotalPrice().toFixed(2)}</p>
            <div className="bg-blue-100 p-4 rounded-md">
              <p className="font-bold">Seu token de desconto: {token}</p>
              <p className="text-sm mt-2">Apresente este token na farmácia para obter seu desconto.</p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold flex items-center">
                <MapPin className="mr-2" />
                Farmácia mais próxima
              </h4>
              <p className="mt-2">Farmácia Saúde Total</p>
              <p>Rua das Flores, 123 - Centro</p>
              <p>Aberta das 8h às 22h</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={goBack} variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={confirmAndSchedule}>Confirmar e Agendar</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Seu Token</h3>
              <p className="text-4xl font-mono">{token}</p>
              <div className="mt-4">
                <p className="font-semibold">Tempo restante:</p>
                <p className="text-2xl">{formatTime(timeLeft)}</p>
                <Progress value={(timeLeft / 300) * 100} className="mt-2" />
              </div>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-semibold flex items-center mb-2">
                <MapPin className="mr-2" />
                Farmácia Agendada
              </h4>
              <p>Farmácia Saúde Total</p>
              <p>Rua das Flores, 123 - Centro</p>
              <p>Data: {new Date().toLocaleDateString()}</p>
              <p>Horário: {new Date().toLocaleTimeString()}</p>
            </div>
            <Button onClick={toggleChat} className="w-full flex items-center justify-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              {isChatOpen ? 'Fechar Chat' : 'Abrir Chat com a Farmácia'}
            </Button>
            {isChatOpen && (
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold mb-2">Chat com a Farmácia</h4>
                <p className="text-gray-600">Conectando ao atendente...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
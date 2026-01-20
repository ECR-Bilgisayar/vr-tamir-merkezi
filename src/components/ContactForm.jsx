
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/components/ui/use-toast';
import { Send } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  company: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  callbackPreference: z.string(),
  platform: z.string(),
  eventDate: z.string(),
  attendeeCount: z.string(),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır')
});

const ContactForm = () => {
  const { addLead } = useLeads();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data) => {
    try {
      console.log('Form Data:', data);
      addLead(data);
      
      toast({
        title: "Talebiniz Alındı! 🎉",
        description: "En kısa sürede size dönüş yapacağız. Teşekkür ederiz!",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-white mb-2 block">Ad Soyad *</Label>
          <input
            id="fullName"
            {...register('fullName')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            placeholder="Adınız Soyadınız"
          />
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <Label htmlFor="company" className="text-white mb-2 block">Firma Adı *</Label>
          <input
            id="company"
            {...register('company')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            placeholder="Firma Adınız"
          />
          {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-white mb-2 block">E-posta *</Label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            placeholder="ornek@email.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-white mb-2 block">Telefon *</Label>
          <input
            id="phone"
            {...register('phone')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            placeholder="0555 555 55 55"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="callbackPreference" className="text-white mb-2 block">Geri Arama Tercihi</Label>
          <select
            id="callbackPreference"
            {...register('callbackPreference')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            <option value="anytime">Herhangi Bir Zaman</option>
            <option value="morning">Sabah (09:00-12:00)</option>
            <option value="afternoon">Öğleden Sonra (12:00-17:00)</option>
            <option value="evening">Akşam (17:00-20:00)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="platform" className="text-white mb-2 block">Platform Tercihi</Label>
          <select
            id="platform"
            {...register('platform')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            <option value="">Seçiniz</option>
            <option value="Meta">Meta Quest 3</option>
            <option value="HTC">HTC Vive XR Elite</option>
            <option value="PSVR">PlayStation VR2</option>
            <option value="Samsung">Samsung Gear VR</option>
            <option value="mixed">Karışık</option>
          </select>
        </div>

        <div>
          <Label htmlFor="eventDate" className="text-white mb-2 block">Etkinlik Tarihi</Label>
          <input
            id="eventDate"
            type="date"
            {...register('eventDate')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="attendeeCount" className="text-white mb-2 block">Tahmini Katılımcı Sayısı</Label>
          <select
            id="attendeeCount"
            {...register('attendeeCount')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
          >
            <option value="">Seçiniz</option>
            <option value="10-20">10-20 kişi</option>
            <option value="20-50">20-50 kişi</option>
            <option value="50-100">50-100 kişi</option>
            <option value="100+">100+ kişi</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-white mb-2 block">Mesajınız *</Label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
          placeholder="Etkinliğiniz hakkında detaylı bilgi verin..."
        />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-6 text-lg"
      >
        <Send className="w-5 h-5 mr-2" />
        Teklif Talebi Gönder
      </Button>
    </form>
  );
};

export default ContactForm;

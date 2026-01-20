
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/components/ui/use-toast';

const AdminLeadsPage = () => {
  const { leads, deleteLead, clearAllLeads } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredLeads = leads.filter(lead =>
    lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    deleteLead(id);
    toast({
      title: "Kayıt Silindi",
      description: "Lead kaydı başarıyla silindi.",
    });
  };

  const handleClearAll = () => {
    if (window.confirm('Tüm lead kayıtlarını silmek istediğinizden emin misiniz?')) {
      clearAllLeads();
      toast({
        title: "Tüm Kayıtlar Silindi",
        description: "Tüm lead kayıtları temizlendi.",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Tarih', 'Ad Soyad', 'Firma', 'E-posta', 'Telefon', 'Platform', 'Katılımcı', 'Mesaj'].join(','),
      ...leads.map(lead => [
        new Date(lead.createdAt).toLocaleDateString('tr-TR'),
        lead.fullName,
        lead.company,
        lead.email,
        lead.phone,
        lead.platform || '-',
        lead.attendeeCount || '-',
        `"${lead.message?.replace(/"/g, '""') || '-'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Dışa Aktarıldı",
      description: "Lead kayıtları CSV olarak indirildi.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin - Lead Yönetimi | VR Kiralama</title>
        <meta name="description" content="VR Kiralama lead yönetim paneli" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-black to-[#0a0e27] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Lead Yönetimi</h1>
              <p className="text-gray-400">Toplam {leads.length} kayıt</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white"
                disabled={leads.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV İndir
              </Button>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                disabled={leads.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Tümünü Temizle
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ad, firma veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
            >
              <p className="text-gray-400 text-lg">
                {leads.length === 0 ? 'Henüz lead kaydı bulunmuyor.' : 'Arama kriterine uygun kayıt bulunamadı.'}
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-white font-semibold">Tarih</th>
                    <th className="p-4 text-left text-white font-semibold">Ad Soyad</th>
                    <th className="p-4 text-left text-white font-semibold">Firma</th>
                    <th className="p-4 text-left text-white font-semibold">E-posta</th>
                    <th className="p-4 text-left text-white font-semibold">Telefon</th>
                    <th className="p-4 text-left text-white font-semibold">Platform</th>
                    <th className="p-4 text-left text-white font-semibold">Katılımcı</th>
                    <th className="p-4 text-center text-white font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-gray-300 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="p-4 text-white font-medium">{lead.fullName}</td>
                      <td className="p-4 text-gray-300">{lead.company}</td>
                      <td className="p-4 text-gray-300">{lead.email}</td>
                      <td className="p-4 text-gray-300">{lead.phone}</td>
                      <td className="p-4 text-gray-300">{lead.platform || '-'}</td>
                      <td className="p-4 text-gray-300">{lead.attendeeCount || '-'}</td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => handleDelete(lead.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLeadsPage;

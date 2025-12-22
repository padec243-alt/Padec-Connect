import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, HelpCircle, Phone, Mail, Clock, ChevronRight, Bot, User } from 'lucide-react';
import { SafeArea } from '../components/MobileLayout';
import { useNavigation } from '../context/NavigationContext';
import { useAuthContext } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Comment créer un compte ?",
    answer: "Pour créer un compte, cliquez sur 'S'inscrire' depuis la page d'accueil, remplissez vos informations personnelles et suivez les étapes de configuration du profil."
  },
  {
    question: "Comment réserver un service ?",
    answer: "Accédez à la section 'Services à la Demande' ou 'E-Services', choisissez le service souhaité, sélectionnez vos options et confirmez votre réservation."
  },
  {
    question: "Comment contacter un entrepreneur ?",
    answer: "Rendez-vous dans le 'Répertoire des Acteurs', trouvez l'entrepreneur souhaité et cliquez sur son profil pour voir ses coordonnées ou lui envoyer un message."
  },
  {
    question: "Comment modifier mon profil ?",
    answer: "Allez dans 'Mon Compte' en bas de l'écran, puis cliquez sur 'Modifier le profil' pour mettre à jour vos informations personnelles."
  },
  {
    question: "Quels sont les moyens de paiement ?",
    answer: "Nous acceptons Mobile Money (M-Pesa, Airtel Money, Orange Money), les cartes bancaires (Visa, Mastercard) et les virements bancaires."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Dans 'Mon Compte', cliquez sur 'Mes commandes' pour voir le statut de toutes vos commandes et réservations en cours."
  }
];

export const AssistanceScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Bonjour${user?.displayName ? ` ${user.displayName.split(' ')[0]}` : ''} ! 👋\n\nBienvenue dans l'assistance PADEC Connect.\n\nEn quoi pouvons-nous vous aider aujourd'hui ?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showFAQ, setShowFAQ] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowFAQ(false);

    // Simuler une réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Merci pour votre message ! Un conseiller PADEC Connect va vous répondre dans les plus brefs délais.\n\nEn attendant, vous pouvez consulter nos questions fréquentes ou nous appeler directement au +243 XXX XXX XXX.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleFAQClick = (index: number) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);

      // Ajouter la question et réponse au chat
      const faq = faqs[index];
      const userMessage: Message = {
        id: Date.now().toString(),
        text: faq.question,
        sender: 'user',
        timestamp: new Date()
      };

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: faq.answer,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage, botResponse]);
      }, 300);
    }
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setShowFAQ(false);

    setTimeout(() => {
      let response = "";
      switch (action) {
        case "Parler à un conseiller":
          response = "Un conseiller va prendre en charge votre demande. Temps d'attente estimé : 2-3 minutes.\n\nVous pouvez également nous appeler au +243 XXX XXX XXX pour une assistance immédiate.";
          break;
        case "Signaler un problème":
          response = "Nous sommes désolés que vous rencontriez un problème. Pouvez-vous nous décrire la situation en détail ? Notre équipe technique examinera votre cas rapidement.";
          break;
        case "Faire une suggestion":
          response = "Nous apprécions vos retours ! Partagez votre suggestion et nous la transmettrons à notre équipe produit. Votre avis nous aide à améliorer PADEC Connect.";
          break;
        default:
          response = "Comment puis-je vous aider ?";
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  return (
    <SafeArea className="bg-slate-950 relative pt-0">
      {/* Header */}
      <div className="p-6 pt-14 flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/50">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Assistance</h1>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            En ligne • Réponse rapide
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/50'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-cyan-100' : 'text-slate-500'}`}>
                {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Quick Actions */}
        {showFAQ && (
          <div className="space-y-4 mt-4">
            {/* Actions rapides */}
            <div className="flex flex-wrap gap-2">
              {["Parler à un conseiller", "Signaler un problème", "Faire une suggestion"].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action)}
                  className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-full text-sm text-cyan-400 hover:bg-slate-700/60 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <HelpCircle size={16} className="text-cyan-400" />
                Questions fréquentes
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleFAQClick(index)}
                    className="w-full text-left p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{faq.question}</span>
                      <ChevronRight size={16} className={`text-slate-500 transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-3">Autres moyens de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Phone size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">+243 XXX XXX XXX</p>
                    <p className="text-xs text-slate-500">Appel gratuit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">support@padec-connect.com</p>
                    <p className="text-xs text-slate-500">Réponse sous 24h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Clock size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Lun - Sam : 8h - 20h</p>
                    <p className="text-xs text-slate-500">Heure de Kinshasa (UTC+1)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-2xl flex items-center px-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              inputMessage.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          Propulsé par PADEC Connect • Assistance 24/7
        </p>
      </div>
    </SafeArea>
  );
};


/**
 * Chat Detail Screen – Angelehnt an das Chatbox Figma UI Kit
 *
 * Design-Vorlage: Chatbox (Community) Figma UI Kit
 * Anpassungen: Eigene Farbpalette (N8TLY), keine Anruf-Optionen
 *
 * Layout:
 * - Header: Zurueck-Pfeil, Avatar, Name + Status, Options-Button
 * - Messages: Bubbles mit abgerundeten Ecken, Datumsseparatoren
 * - Bottom Bar: Attachment + Kamera links, Eingabefeld mit Emoji,
 *   Sende-Button erscheint nur bei Inhalt (Chatbox-Pattern)
 *
 * Route: /chat/[id] – Die ID ist die conversation_id aus Supabase.
 */
import { View, Text, FlatList, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import {
  getConversationById,
  getMessages,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  markConversationAsRead,
} from '../../services/chatService';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { PaperAirplaneIcon, UserIcon } from 'react-native-heroicons/solid';
import {
  PaperClipIcon,
  CameraIcon,
  FaceSmileIcon,
  EllipsisHorizontalIcon,
  MicrophoneIcon,
  XMarkIcon,
  DocumentIcon,
  ChartBarIcon,
  PhotoIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';
import { UserGroupIcon } from 'react-native-heroicons/solid';

export default function ChatDetailScreen() {
  // Konversations-ID aus der Route
  const { id: conversationId } = useLocalSearchParams();
  const router = useRouter();

  // State fuer Nachrichten, Konversation und Eingabe
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Refs fuer FlatList-Scrolling und Realtime-Channel
  const flatListRef = useRef(null);
  const channelRef = useRef(null);

  // State und Animation fuer das "Share Content" Bottom Sheet
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const shareSheetAnim = useRef(new Animated.Value(0)).current;

  // Prueft ob der Send-Button angezeigt werden soll
  const hasContent = inputText.trim().length > 0;

  // ============================
  // Initialisierung: User, Chat-Daten und Realtime
  // ============================
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Aktuellen User ermitteln
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid || !mounted) return;
      setUserId(uid);

      // Konversation laden (fuer Header-Infos)
      const conv = await getConversationById(conversationId);
      if (mounted && conv) {
        // Bei Einzelchats: Namen und Avatar des Chat-Partners ermitteln
        if (conv.type === 'direct') {
          const other = conv.conversation_participants?.find((p) => p.user_id !== uid);
          conv.displayName = other?.profiles?.username || 'Unbekannt';
          conv.displayAvatar = other?.profiles?.avatar_url || null;
        } else {
          conv.displayName = conv.name || 'Gruppe';
          conv.displayAvatar = conv.avatar_url || null;
        }
        setConversation(conv);
      }

      // Nachrichten laden (neueste zuerst, FlatList ist inverted)
      const msgs = await getMessages(conversationId, 50, 0);
      if (mounted) setMessages(msgs);
      setLoading(false);

      // Chat als gelesen markieren
      await markConversationAsRead(conversationId, uid);

      // Realtime-Abo: Neue Nachrichten sofort anzeigen
      channelRef.current = subscribeToMessages(conversationId, (newMsg) => {
        if (!mounted) return;
        setMessages((prev) => {
          // Duplikate vermeiden (falls Message schon durch sendMessage hinzugefuegt)
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [newMsg, ...prev]; // Vorne einfuegen (neueste zuerst)
        });

        // Nachricht als gelesen markieren wenn von anderem User
        if (newMsg.sender_id !== uid) {
          markConversationAsRead(conversationId, uid);
        }
      });
    };

    init();

    // Aufraemen: Realtime-Abo entfernen beim Verlassen
    return () => {
      mounted = false;
      if (channelRef.current) {
        unsubscribeFromMessages(channelRef.current);
      }
    };
  }, [conversationId]);

  // ============================
  // Nachricht senden
  // ============================
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !userId || sending) return;

    setSending(true);
    setInputText(''); // Eingabefeld sofort leeren (optimistic UI)

    try {
      const msg = await sendMessage(conversationId, userId, text);

      // Nachricht lokal hinzufuegen (optimistic – Realtime liefert evtl. auch)
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [{ ...msg, profiles: { id: userId } }, ...prev];
      });
    } catch (err) {
      console.error('Fehler beim Senden:', err);
      // Bei Fehler: Text wiederherstellen
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  // ============================
  // Share Sheet oeffnen/schliessen (Slide-up Animation)
  // ============================

  /** Share Sheet von unten einblenden */
  const openShareSheet = () => {
    setShareSheetVisible(true);
    Animated.spring(shareSheetAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  /** Share Sheet nach unten ausblenden und dann Modal schliessen */
  const closeShareSheet = () => {
    Animated.timing(shareSheetAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShareSheetVisible(false);
    });
  };

  // Bildschirmhoehe fuer die Slide-Animation
  const screenHeight = Dimensions.get('window').height;

  // Share-Optionen: Jede Option hat ein Icon, Label, Beschreibung und ggf. eine Bedingung
  const shareOptions = [
    {
      key: 'camera',
      icon: <CameraIcon size={24} strokeWidth={1.8} color={theme.colors.neutral.gray[700]} />,
      label: 'Kamera',
      subtitle: null,
    },
    {
      key: 'documents',
      icon: <DocumentIcon size={24} strokeWidth={1.8} color={theme.colors.neutral.gray[700]} />,
      label: 'Dokumente',
      subtitle: 'Dateien teilen',
    },
    {
      key: 'poll',
      icon: <ChartBarIcon size={24} strokeWidth={1.8} color={theme.colors.neutral.gray[700]} />,
      label: 'Umfrage erstellen',
      subtitle: 'Frage an die Gruppe stellen',
      // Nur in Gruppenchats verfuegbar
      groupOnly: true,
    },
    {
      key: 'media',
      icon: <PhotoIcon size={24} strokeWidth={1.8} color={theme.colors.neutral.gray[700]} />,
      label: 'Medien',
      subtitle: 'Fotos und Videos teilen',
    },
    {
      key: 'contact',
      icon: <UserGroupIcon size={24} color={theme.colors.neutral.gray[700]} />,
      label: 'Kontakt',
      subtitle: 'Kontakte teilen',
    },
    {
      key: 'location',
      icon: <MapPinIcon size={24} strokeWidth={1.8} color={theme.colors.neutral.gray[700]} />,
      label: 'Standort',
      subtitle: 'Standort teilen',
    },
  ];

  /**
   * Formatiert den Zeitstempel einer Nachricht (z.B. "14:30").
   */
  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Prueft ob ein Datumsseparator zwischen zwei Nachrichten angezeigt werden soll.
   */
  const shouldShowDateSeparator = (currentMsg, nextMsg) => {
    if (!nextMsg) return true;
    const currentDate = new Date(currentMsg.created_at).toDateString();
    const nextDate = new Date(nextMsg.created_at).toDateString();
    return currentDate !== nextDate;
  };

  /**
   * Formatiert ein Datum fuer den Separator (Heute/Gestern/Datum).
   */
  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // ============================
  // Nachrichten-Bubble rendern (Chatbox-Style)
  // ============================
  const renderMessage = ({ item, index }) => {
    const isOwn = item.sender_id === userId;
    const isSystem = item.message_type === 'system';

    // Datumsseparator pruefen
    const nextMsg = messages[index + 1];
    const showDate = shouldShowDateSeparator(item, nextMsg);

    return (
      <View>
        {/* Datumsseparator: Zentriertes Datum-Badge */}
        {showDate && (
          <View className="items-center py-4">
            <View className="px-4 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.neutral.gray[100] }}>
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: 'Manrope_500Medium' }}
              >
                {formatDateSeparator(item.created_at)}
              </Text>
            </View>
          </View>
        )}

        {/* System-Nachricht (zentriert, dezent) */}
        {isSystem ? (
          <View className="items-center py-2 px-10">
            <Text
              className="text-xs text-gray-400 text-center"
              style={{ fontFamily: 'Manrope_400Regular' }}
            >
              {item.content}
            </Text>
          </View>
        ) : (
          /* Chatbox-Style Message Bubble */
          <View className={`flex-row px-4 mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar links (nur bei fremden Nachrichten in Gruppenchats) */}
            {!isOwn && conversation?.type === 'group' && (
              <View className="mr-2.5 self-end mb-1">
                {item.profiles?.avatar_url ? (
                  <Image
                    source={{ uri: item.profiles.avatar_url }}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                    <UserIcon size={16} color={theme.colors.neutral.gray[400]} />
                  </View>
                )}
              </View>
            )}

            {/* Bubble: Chatbox-typisch mit einer flachen Ecke */}
            <View
              style={[
                styles.bubble,
                isOwn ? styles.bubbleOwn : styles.bubbleOther,
              ]}
            >
              {/* Absender-Name in Gruppenchats */}
              {!isOwn && conversation?.type === 'group' && item.profiles?.username && (
                <Text style={[styles.senderName, { color: theme.colors.primary.main }]}>
                  {item.profiles.username}
                </Text>
              )}

              {/* Nachrichtentext */}
              <Text
                style={[
                  styles.messageText,
                  { color: isOwn ? '#FFFFFF' : theme.colors.neutral.gray[900] },
                ]}
              >
                {item.content}
              </Text>

              {/* Zeitstempel rechts unten */}
              <Text
                style={[
                  styles.timestamp,
                  {
                    color: isOwn
                      ? 'rgba(255,255,255,0.6)'
                      : theme.colors.neutral.gray[400],
                  },
                ]}
              >
                {formatMessageTime(item.created_at)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  /**
   * Untertitel im Header (Online-Status oder Teilnehmerzahl).
   */
  const getSubtitle = () => {
    if (!conversation) return '';
    if (conversation.type === 'direct') return 'Online';
    const count = conversation.conversation_participants?.length || 0;
    return `${count} Teilnehmer`;
  };

  // ============================
  // RENDER
  // ============================
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ============================================
            HEADER: Chatbox-Style – Zurueck, Avatar, Name
            ============================================ */}
        <View style={styles.header}>
          {/* Zurueck-Pfeil */}
          <Pressable
            style={styles.headerBtn}
            onPress={() => router.back()}
          >
            <ChevronLeftIcon size={28} color={theme.colors.neutral.gray[900]} strokeWidth={2.5} />
          </Pressable>

          {/* Avatar + Name + Status (tappbar fuer Profil-Info) */}
          <Pressable style={styles.headerProfile}>
            {conversation?.displayAvatar ? (
              <Image
                source={{ uri: conversation.displayAvatar }}
                style={styles.headerAvatar}
              />
            ) : (
              <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                <UserIcon size={22} color={theme.colors.neutral.gray[400]} />
              </View>
            )}

            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {conversation?.displayName || 'Chat'}
              </Text>
              <View style={styles.headerStatusRow}>
                {/* Gruener Online-Punkt bei Einzelchats */}
                {conversation?.type === 'direct' && (
                  <View style={styles.onlineDot} />
                )}
                <Text style={styles.headerStatus}>
                  {getSubtitle()}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Options-Button (Gallery, Chat-Info etc.) */}
          <Pressable style={styles.headerBtn}>
            <EllipsisHorizontalIcon size={28} strokeWidth={2} color={theme.colors.neutral.gray[700]} />
          </Pressable>
        </View>

        {/* ============================================
            NACHRICHTEN-LISTE (inverted FlatList)
            ============================================ */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#FFFFFF' }}
        />

        {/* ============================================
            BOTTOM BAR: Chatbox-Style Eingabebereich
            Links: Attachment + Kamera
            Mitte: Eingabefeld mit Emoji-Icon
            Rechts: Sende-Button (nur bei Inhalt sichtbar)
            ============================================ */}
        <View style={styles.inputBar}>
          <View style={styles.inputRow}>
            {/* Attachment-Button – oeffnet das "Share Content" Bottom Sheet */}
            <Pressable style={styles.inputAction} onPress={openShareSheet}>
              <PaperClipIcon size={26} strokeWidth={2} color={theme.colors.neutral.gray[600]} />
            </Pressable>

            {/* Eingabefeld mit Emoji-Icon rechts darin */}
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Nachricht schreiben..."
                placeholderTextColor={theme.colors.neutral.gray[400]}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={2000}
              />
              {/* Emoji-Button innerhalb des Eingabefelds (rechte Seite) */}
              <Pressable style={styles.emojiBtn}>
                <FaceSmileIcon size={26} strokeWidth={2} color={theme.colors.neutral.gray[500]} />
              </Pressable>
            </View>

            {/* Kamera-Button (Foto aufnehmen) – nur sichtbar wenn kein Text eingegeben */}
            {!hasContent && (
              <Pressable style={styles.inputAction}>
                <CameraIcon size={26} strokeWidth={2} color={theme.colors.neutral.gray[600]} />
              </Pressable>
            )}

            {/* Mikrofon-Button (Sprachnachricht) – nur sichtbar wenn kein Text eingegeben */}
            {!hasContent && (
              <Pressable style={styles.inputAction}>
                <MicrophoneIcon size={26} strokeWidth={2} color={theme.colors.neutral.gray[600]} />
              </Pressable>
            )}

            {/* Sende-Button: Erscheint NUR wenn Text vorhanden ist (Chatbox-Pattern) */}
            {hasContent && (
              <Pressable
                style={[styles.sendBtn, { backgroundColor: theme.colors.primary.main }]}
                onPress={handleSend}
                disabled={sending}
              >
                <PaperAirplaneIcon size={20} strokeWidth={2.5} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* SafeArea-Padding unten (Home-Indicator auf neueren iPhones) */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FFFFFF' }} />
      </KeyboardAvoidingView>

      {/* ============================================
          SHARE CONTENT BOTTOM SHEET (Modal mit Slide-Animation)
          Wird durch den PaperClip-Button geoeffnet.
          ============================================ */}
      <Modal
        visible={shareSheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeShareSheet}
      >
        {/* Halbtransparenter Hintergrund – Tippen schliesst das Sheet */}
        <Pressable style={shareStyles.overlay} onPress={closeShareSheet}>
          <Animated.View
            style={[
              shareStyles.sheet,
              {
                transform: [
                  {
                    translateY: shareSheetAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [screenHeight, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Sheet abfangen damit Tippen innerhalb nicht schliesst */}
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Header: X-Button + Titel */}
              <View style={shareStyles.sheetHeader}>
                <Pressable style={shareStyles.closeBtn} onPress={closeShareSheet}>
                  <XMarkIcon size={24} strokeWidth={2} color={theme.colors.neutral.gray[700]} />
                </Pressable>
                <Text style={shareStyles.sheetTitle}>Inhalt teilen</Text>
                {/* Platzhalter fuer symmetrisches Layout */}
                <View style={shareStyles.closeBtn} />
              </View>

              {/* Optionsliste */}
              {shareOptions
                .filter((opt) => {
                  // "Umfrage erstellen" nur bei Gruppenchats anzeigen
                  if (opt.groupOnly && conversation?.type !== 'group') return false;
                  return true;
                })
                .map((opt) => (
                  <Pressable
                    key={opt.key}
                    style={shareStyles.optionRow}
                    onPress={() => {
                      closeShareSheet();
                      // TODO: Jeweilige Aktion ausfuehren (Kamera oeffnen, Datei waehlen etc.)
                    }}
                  >
                    {/* Rundes Icon-Container (helles Grau) */}
                    <View style={shareStyles.optionIcon}>
                      {opt.icon}
                    </View>
                    {/* Label + optionaler Untertitel */}
                    <View style={shareStyles.optionText}>
                      <Text style={shareStyles.optionLabel}>{opt.label}</Text>
                      {opt.subtitle && (
                        <Text style={shareStyles.optionSubtitle}>{opt.subtitle}</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ============================
// Styles: Chatbox UI Kit Pattern
// ============================
const styles = StyleSheet.create({
  // -- HEADER --
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[100],
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.neutral.gray[100],
  },
  headerAvatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    color: theme.colors.neutral.gray[900],
    fontFamily: 'Manrope_700Bold',
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  // Gruener Online-Indikator-Punkt
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 5,
  },
  headerStatus: {
    fontSize: 12,
    color: theme.colors.neutral.gray[500],
    fontFamily: 'Manrope_400Regular',
  },

  // -- MESSAGE BUBBLES --
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  // Eigene Nachricht: Primaerfarbe, rechts unten flache Ecke
  bubbleOwn: {
    backgroundColor: theme.colors.primary.main,
    borderBottomRightRadius: 4,
  },
  // Fremde Nachricht: Helles Grau, links unten flache Ecke
  bubbleOther: {
    backgroundColor: theme.colors.neutral.gray[100],
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'Manrope_400Regular',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  // -- BOTTOM INPUT BAR --
  inputBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // Einzelne Action-Buttons (Attachment, Kamera)
  inputAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Container fuer das Eingabefeld (mit Emoji-Button darin)
  inputFieldContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.neutral.gray[100],
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    minHeight: 42,
    maxHeight: 120,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.neutral.gray[900],
    fontFamily: 'Manrope_400Regular',
    paddingVertical: 0,
    maxHeight: 100,
  },
  // Emoji-Button rechts im Eingabefeld
  emojiBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  // Sende-Button (runder Kreis mit Pfeil, erscheint nur bei Inhalt)
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ============================
// Styles: Share Content Bottom Sheet
// Angelehnt an das Chatbox Figma UI Kit
// ============================
const shareStyles = StyleSheet.create({
  // Halbtransparenter Overlay-Hintergrund
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  // Das eigentliche Sheet (weisser Container mit abgerundeten oberen Ecken)
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  // Header-Bereich: X-Button links, Titel mittig
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[100],
  },
  // Schliessen-Button (X oben links)
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Titel "Inhalt teilen"
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: theme.colors.neutral.gray[900],
  },
  // Einzelne Option (Zeile mit Icon + Text)
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[50],
  },
  // Rundes Icon-Container (hellgrauer Kreis um das Icon)
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.neutral.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  // Textbereich rechts neben dem Icon
  optionText: {
    flex: 1,
  },
  // Hauptlabel (z.B. "Kamera", "Dokumente")
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: theme.colors.neutral.gray[900],
  },
  // Optionaler Untertitel (z.B. "Dateien teilen")
  optionSubtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    color: theme.colors.neutral.gray[500],
    marginTop: 2,
  },
});

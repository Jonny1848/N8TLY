import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search, Users, Plus, MessageCircle, Image as ImageIcon } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function SocialScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');

  // Dummy data für die Vorschau
  const conversations = [
    { 
      id: '1', 
      name: 'Techno Squad', 
      lastMessage: 'Wer kommt heute mit zu Berghain?',
      time: '2 Min',
      unread: 3,
      isGroup: true,
      hasMemories: true,
    },
    { 
      id: '2', 
      name: 'Lisa Schmidt', 
      lastMessage: 'Hast du das Event gesehen? 🔥',
      time: '1 Std',
      unread: 0,
      isGroup: false,
      hasMemories: false,
    },
    { 
      id: '3', 
      name: 'Rooftop Crew', 
      lastMessage: 'Max hat ein Foto geteilt',
      time: 'Gestern',
      unread: 0,
      isGroup: true,
      hasMemories: true,
    },
  ];

  const friends = [
    { id: '1', name: 'Max Müller', status: 'Geht zu 2 Events', isOnline: true },
    { id: '2', name: 'Lisa Schmidt', status: 'Berghain, Heute 23:00', isOnline: true },
    { id: '3', name: 'Tom Wagner', status: 'Offline', isOnline: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4">
        <Text className="text-3xl font-bold text-gray-900">Social</Text>
        <Pressable className="w-10 h-10 rounded-xl justify-center items-center" 
                  style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
          <Plus size={22} color={theme.colors.primary.main} strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 gap-3">
          <Search size={20} color={theme.colors.neutral.gray[400]} />
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Chats oder Freunde suchen..."
            placeholderTextColor={theme.colors.neutral.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 gap-3 mb-4">
        <Pressable 
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
            activeTab === 'chats' ? '' : 'bg-gray-100'
          }`}
          style={activeTab === 'chats' ? { backgroundColor: `${theme.colors.primary.main}15` } : {}}
          onPress={() => setActiveTab('chats')}
        >
          <MessageCircle 
            size={18} 
            color={activeTab === 'chats' ? theme.colors.primary.main : theme.colors.neutral.gray[600]} 
          />
          <Text className={`text-sm font-semibold ${
            activeTab === 'chats' ? '' : 'text-gray-600'
          }`} style={activeTab === 'chats' ? { color: theme.colors.primary.main } : {}}>
            Chats
          </Text>
          {conversations.some(c => c.unread > 0) && (
            <View className="px-1.5 py-0.5 rounded-full min-w-5 items-center" 
                  style={{ backgroundColor: theme.colors.primary.main }}>
              <Text className="text-xs font-bold text-white">
                {conversations.filter(c => c.unread > 0).length}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable 
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
            activeTab === 'friends' ? '' : 'bg-gray-100'
          }`}
          style={activeTab === 'friends' ? { backgroundColor: `${theme.colors.primary.main}15` } : {}}
          onPress={() => setActiveTab('friends')}
        >
          <Users 
            size={18} 
            color={activeTab === 'friends' ? theme.colors.primary.main : theme.colors.neutral.gray[600]} 
          />
          <Text className={`text-sm font-semibold ${
            activeTab === 'friends' ? '' : 'text-gray-600'
          }`} style={activeTab === 'friends' ? { color: theme.colors.primary.main } : {}}>
            Freunde
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {activeTab === 'chats' ? (
          <>
            {conversations.map((chat) => (
              <Pressable key={chat.id} className="flex-row px-5 py-3 gap-3">
                {/* Avatar */}
                <View className="relative">
                  <View className={`w-14 h-14 rounded-full justify-center items-center ${
                    chat.isGroup ? '' : 'bg-gray-200'
                  }`} style={chat.isGroup ? { backgroundColor: `${theme.colors.primary.main}15` } : {}}>
                    {chat.isGroup ? (
                      <Users size={24} color={theme.colors.neutral.gray[600]} />
                    ) : (
                      <Text className="text-lg font-bold text-gray-700">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    )}
                  </View>
                  {chat.hasMemories && (
                    <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full justify-center items-center border-2 border-white" 
                          style={{ backgroundColor: theme.colors.primary.main }}>
                      <ImageIcon size={12} color="#fff" />
                    </View>
                  )}
                </View>

                {/* Chat Info */}
                <View className="flex-1 justify-center">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-semibold text-gray-900">{chat.name}</Text>
                    <Text className="text-xs text-gray-500">{chat.time}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text 
                      className={`flex-1 text-sm ${chat.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
                      numberOfLines={1}
                    >
                      {chat.lastMessage}
                    </Text>
                    {chat.unread > 0 && (
                      <View className="px-2 py-1 rounded-xl min-w-6 items-center ml-2" 
                            style={{ backgroundColor: theme.colors.primary.main }}>
                        <Text className="text-xs font-bold text-white">{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}

            {/* Event Memories Section */}
            <View className="m-5 p-5 rounded-2xl border" 
                  style={{ 
                    backgroundColor: `${theme.colors.primary.main}08`,
                    borderColor: `${theme.colors.primary.main}20`
                  }}>
              <View className="flex-row items-center gap-2 mb-2">
                <ImageIcon size={20} color={theme.colors.primary.main} />
                <Text className="text-base font-bold text-gray-900">Event Memories</Text>
              </View>
              <Text className="text-sm text-gray-600 leading-5 mb-4">
                Teile Fotos und Momente von deinen Events mit deinen Freunden
              </Text>
              <Pressable className="py-3 rounded-xl items-center" 
                        style={{ backgroundColor: theme.colors.primary.main }}>
                <Text className="text-sm font-semibold text-white">Alle Memories anzeigen</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            {/* Friends List */}
            {friends.map((friend) => (
              <Pressable key={friend.id} className="flex-row items-center px-5 py-3 gap-3">
                <View className="relative">
                  <View className="w-14 h-14 rounded-full bg-gray-200 justify-center items-center">
                    <Text className="text-lg font-bold text-gray-700">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  {friend.isOnline && (
                    <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" 
                          style={{ backgroundColor: '#10B981' }} />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 mb-1">{friend.name}</Text>
                  <Text className="text-sm text-gray-600">{friend.status}</Text>
                </View>

                <Pressable className="w-10 h-10 rounded-xl justify-center items-center" 
                          style={{ backgroundColor: `${theme.colors.primary.main}15` }}>
                  <MessageCircle size={20} color={theme.colors.primary.main} />
                </Pressable>
              </Pressable>
            ))}

            {/* Add Friends Section */}
            <View className="p-5">
              <Pressable className="flex-row items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed" 
                        style={{ 
                          borderColor: theme.colors.primary.main,
                          backgroundColor: `${theme.colors.primary.main}05`
                        }}>
                <Plus size={24} color={theme.colors.primary.main} strokeWidth={2} />
                <Text className="text-base font-semibold" style={{ color: theme.colors.primary.main }}>
                  Neue Freunde finden
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
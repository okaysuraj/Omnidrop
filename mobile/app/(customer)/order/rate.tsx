import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RateOrderScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent!'];
  const tags = ['Freshness', 'Packaging', 'Speed', 'Portion Size', 'Temperature', 'Taste'];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* Transactional Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#191c1d" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Your Order</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Order Context Card */}
          <View style={styles.contextCard}>
            <View style={styles.contextImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300' }} 
                style={styles.contextImage} 
              />
            </View>
            <View style={styles.contextText}>
              <Text style={styles.contextTitle} numberOfLines={1}>Spicy Salmon Poke Bowl</Text>
              <Text style={styles.contextSubtitle}>Delivered today at 1:45 PM</Text>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>How was your order?</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="star" 
                    size={48} 
                    color={star <= rating ? '#00ff5f' : '#e1e3e4'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.ratingLabel, { opacity: rating > 0 ? 1 : 0 }]}>
              {rating > 0 ? ratingLabels[rating - 1] : ' '}
            </Text>
          </View>

          {/* Tags Section (Only show if rating > 0) */}
          {rating > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.tagsTitle}>What stood out to you?</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity 
                      key={tag}
                      style={[styles.tagBtn, isSelected && styles.tagBtnSelected]}
                      onPress={() => handleTagToggle(tag)}
                    >
                      <Text style={[styles.tagBtnText, isSelected && styles.tagBtnTextSelected]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Additional comments</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="Tell us more about your experience..."
              placeholderTextColor="rgba(59, 75, 57, 0.5)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

        </ScrollView>

        {/* Sticky Bottom Action */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} 
            disabled={rating === 0}
            onPress={() => router.push('/(customer)/home')}
          >
            <Text style={[styles.submitBtnText, rating === 0 && styles.submitBtnTextDisabled]}>Submit Review</Text>
            <MaterialIcons name="send" size={20} color={rating === 0 ? 'rgba(0, 113, 37, 0.5)' : '#007125'} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(225, 227, 228, 0.5)',
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 120, // Space for bottom bar
  },
  contextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 227, 228, 0.5)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    marginBottom: 40,
  },
  contextImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#e7e8e9',
    overflow: 'hidden',
    marginRight: 16,
  },
  contextImage: {
    width: '100%',
    height: '100%',
  },
  contextText: {
    flex: 1,
  },
  contextTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 4,
  },
  contextSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#3b4b39',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ratingTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#191c1d',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#006e24',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagsSection: {
    marginBottom: 32,
  },
  tagsTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: '#191c1d',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#b9ccb5',
    backgroundColor: 'transparent',
  },
  tagBtnSelected: {
    backgroundColor: '#00ff5f',
    borderColor: 'transparent',
  },
  tagBtnText: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#3b4b39',
  },
  tagBtnTextSelected: {
    color: '#007125',
    fontFamily: 'Montserrat_700Bold',
  },
  commentsSection: {
    marginBottom: 32,
  },
  commentsTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: '#191c1d',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b9ccb5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#191c1d',
    minHeight: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(225, 227, 228, 0.3)',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff5f',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#00ff5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(0, 255, 95, 0.3)',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#007125',
  },
  submitBtnTextDisabled: {
    color: 'rgba(0, 113, 37, 0.5)',
  },
});

import React from 'react';
import { View } from 'react-native';
import { theme } from '../constants/theme';

/**
 * ProgressBar - Wiederverwendbare Fortschrittsanzeige für Onboarding-Screens
 * 
 * Diese Komponente zeigt eine horizontale Fortschrittsleiste mit mehreren Segmenten an.
 * Ausgefüllte Segmente (bis currentStep) werden in der primären Theme-Farbe dargestellt,
 * während verbleibende Segmente in einer neutralen Graufarbe erscheinen.
 * 
 * @param {number} currentStep - Der aktuelle Schritt (1-basiert, z.B. Schritt 2 von 10)
 * @param {number} totalSteps - Die Gesamtanzahl der Schritte (z.B. 10)
 * @returns {JSX.Element} Eine horizontale Fortschrittsleiste
 */
const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <View className="flex-row gap-1 mb-8">
      {/* Erstelle ein Array mit totalSteps Elementen und iteriere darüber */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className="flex-1 h-1 rounded-full"
          style={{
            // Färbe das Segment mit der Primärfarbe, wenn es abgeschlossen ist (index < currentStep)
            // Andernfalls verwende eine neutrale Graufarbe für noch nicht erreichte Schritte
            backgroundColor: index < currentStep ? theme.colors.primary.main : '#e5e7eb'
          }}
        />
      ))}
    </View>
  );
};

export default ProgressBar;

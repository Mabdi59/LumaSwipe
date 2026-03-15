import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { blurWebActiveElement } from '../utils/web';

export function useBlurActiveElementOnBlur() {
  useFocusEffect(
    useCallback(() => {
      return () => {
        blurWebActiveElement();
      };
    }, [])
  );
}

import { Stack } from 'expo-router';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';


export default function RootLayout() {
  return (
    <>
      <Stack>

        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: '#208AEF'
            }
          }}
        />



        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: '#208AEF'
            }
          }}
        />

        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: '#208AEF'
            }
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="payment"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="qr_scanner"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="verify-pin"
          options={{
            headerShown: false,
          }}
        />

      </Stack>

      <Toast config={toastConfig} />
    </>
  );
};

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#208AEF',
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
      }}
    />
  ),
};
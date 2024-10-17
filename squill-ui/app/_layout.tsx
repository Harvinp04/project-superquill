import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen  options={{title:'SQuill', headerShown:false}} name="index" />
    </Stack>
  );
}

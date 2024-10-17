import { Text, Button, View, Image } from "react-native";
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { SketchCanvas, SketchCanvasRef } from 'rn-perfect-sketch-canvas';

import { Undo2, ImageUp, Redo2, Settings2 } from 'lucide-react-native';
import { Color } from "@shopify/react-native-skia";



export default function Index() {

  // const config = createTamagui(defaultConfig)
  const canvasRef = useRef<SketchCanvasRef>(null);

  const [stroke, setStroke] = useState<Color>('#000000')

  const handleReset = () => {
    if (canvasRef.current) {
      console.log('reset')
      canvasRef.current.reset();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
     
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {

      canvasRef.current.redo();
    }
  };

  const handleSend = async () => {
    if (canvasRef.current) {

      console.log('begin send')
      const imageData = canvasRef.current.toBase64();

      try {
        const response = await fetch("http://<REPLACE WITH YOUR IPV4 FOR LOCAL TESTING>/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageData }),
        });

        if (response.ok) {
          console.log("image sent successfully");
        } else {
          console.error("Failed to send image");
        }
      } catch (error) {
        console.error("Error sending image:", error);
      }
    }
  };


  return (

    <>

      <SafeAreaView style={styles.container}>

        <View style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', backgroundColor: '#EEEEEE', paddingHorizontal: 40, paddingTop: 5, paddingBottom:10, flexDirection: 'column' }}>

          <View style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Image source={require('@/assets/images/squill-rotated.png')} style={{ height: 32, width: 32 }} />
            <Settings2 color="black" size={32} />
          </View>



        </View>

        <SketchCanvas
          ref={canvasRef}
          strokeColor={stroke}
          strokeWidth={8}
          containerStyle={styles.canvas}
        />

        
        <View style={{  alignItems: 'center', alignSelf:'center',backgroundColor: '#FFFFFF', borderRadius: 80, padding: 10 , margin:10, paddingHorizontal:20, display:'flex', flexDirection:'row', justifyContent:'center', gap:20}}>
         

        <Pressable onPress={()=> setStroke('#000000')} style={{backgroundColor:'#000000', borderColor:'#EEEEEE',  borderRadius:20, width:40, height:40}}></Pressable>
          <Pressable onPress={()=> setStroke('#DD0000')} style={{backgroundColor:'#DD0000', borderColor:'#EEEEEE',  borderRadius:20, width:40, height:40}}/>
          <Pressable onPress={()=> setStroke('#009900')} style={{backgroundColor:'#009900', borderColor:'#EEEEEE',  borderRadius:20, width:40, height:40}}/>
          <Pressable onPress={()=> setStroke('#0000DD')}style={{backgroundColor:'#0000DD', borderColor:'#EEEEEE',  borderRadius:20, width:40, height:40}}/>
          <Pressable onPress={handleUndo}>
          <Undo2 color="black" size={40} />
          </Pressable>

          <Pressable onPress={handleRedo}>
          <Redo2 color="black" size={40} />
          </Pressable>

          <Pressable onPress={handleSend}>
          <ImageUp color="black" size={40} />
          </Pressable>
         
         
            
          
         
        </View>
       

      </SafeAreaView>
    </>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE'
  },

  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

});
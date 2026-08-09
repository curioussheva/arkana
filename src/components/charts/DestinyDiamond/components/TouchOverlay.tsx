import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface TouchOverlayProps {
  allNodes: Array<any>;
  onNodePress: (node: any) => void;
}

export const TouchOverlay: React.FC<TouchOverlayProps> = ({ allNodes, onNodePress }) => {
  return (
    <>
      {allNodes.map(node => {
        const touchSize = node.radius * 2.3;
        return (
          <TouchableOpacity
            key={`touch-${node.key}`}
            activeOpacity={0.6}
            onPress={() => onNodePress(node)}
            style={[
              styles.touchTarget,
              {
                left: node.pixel.x - touchSize / 2,
                top: node.pixel.y - touchSize / 2,
                width: touchSize,
                height: touchSize,
              },
            ]}
          />
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  touchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

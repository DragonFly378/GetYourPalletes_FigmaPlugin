figma.showUI(__html__, {
  width: 480,
  height: 500,
  title: "Get Your Palletes",
});

// Message recieved
figma.ui.onmessage = (msg) => {
  if (msg.type === "actionGenerate") {
    // console.log(msg.formDataObj);

    const datas = msg.formDataObj;

    // datas?.colors.map((item, itemIdx) => {
    //   console.log(item);
    // });

    generateColors(datas);

    figma.closePlugin("Pallete generated successfully!");
  } else if (msg.type === "actionExit") {
    figma.closePlugin("Thanks, See you later!");
  }
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const generateColors = (datas: any) => {
  const parentFrame = figma.createFrame();
  parentFrame.name = "Color Palletes";
  parentFrame.layoutMode = "VERTICAL";
  parentFrame.verticalPadding = 30;
  parentFrame.horizontalPadding = 30;
  parentFrame.itemSpacing = 32;

  parentFrame.primaryAxisSizingMode = "AUTO";
  parentFrame.counterAxisSizingMode = "AUTO";

  console.log(datas.colors);
  const colors = datas.colors;

  colors.map((item: any, itemIdx: Integer) => {
    const colorFrame = figma.createFrame();
    colorFrame.layoutMode = "HORIZONTAL";
    // colorFrame.fills = [
    //   {
    //     type: "SOLID",
    //     color: {
    //       r: 0,
    //       g: 0,
    //       b: 0,
    //     },
    //   },
    // ];
    colorFrame.name = `color-${item.colorName}`;
    colorFrame.verticalPadding = 0;
    colorFrame.horizontalPadding = 0;
    colorFrame.itemSpacing = 15;

    for (let i = 0; i < 10; i++) {
      const colorNode = figma.createEllipse();
      colorNode.name = `${item.colorName}-${100 - i * 10}`;
      colorNode.opacity = (100 - i * 10) / 100;
      colorNode.fills = [
        {
          type: "SOLID",
          color: {
            r: hexToRgb(item.colorCode)?.r / 255,
            g: hexToRgb(item.colorCode)?.g / 255,
            b: hexToRgb(item.colorCode)?.b / 255,
          },
        },
      ];

      // Add the node to each frame
      colorFrame.appendChild(colorNode);
    }

    parentFrame.appendChild(colorFrame);
  });
};

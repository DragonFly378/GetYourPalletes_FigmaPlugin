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

    const myFontLoadingFunction = async () => {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      // console.log("tolong");
    };

    // generateColors(datas);
    myFontLoadingFunction().then(() => {
      // generateColorsTransparent(datas);
      generateColors(datas);

      figma.closePlugin("Pallete generated successfully!, Thank you");
    });
  } else if (msg.type === "actionExit") {
    figma.closePlugin("Thanks, See you later!");
  }
};

const rgbToHex = (r, g, b) => {
  // Pastikan nilai RGB berada di dalam rentang 0 hingga 255
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("Nilai RGB harus berada di antara 0 dan 255.");
  }

  // Mengonversi nilai RGB menjadi HEX
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  parentFrame.itemSpacing = 50;

  parentFrame.primaryAxisSizingMode = "AUTO";
  parentFrame.counterAxisSizingMode = "AUTO";

  // console.log(datas.colors);
  // const colors = datas.colors;

  // Perbedaan rata-rata untuk masing-masing komponen warna RGB
  const steps = 10;

  datas.colors.map((item: any, itemIdx: Integer) => {
    const colorFrame = figma.createFrame();
    colorFrame.layoutMode = "HORIZONTAL";
    colorFrame.name = `color-${item.colorName}`;
    colorFrame.verticalPadding = 0;
    colorFrame.horizontalPadding = 0;
    colorFrame.itemSpacing = 15;
    colorFrame.layoutSizingVertical = "HUG";

    for (let i = 0; i < 10; i++) {
      const eachColorFrame = figma.createFrame();
      eachColorFrame.layoutMode = "VERTICAL";
      eachColorFrame.name = `${item.colorName}-${100 - i * 10}`;
      eachColorFrame.verticalPadding = 0;
      eachColorFrame.horizontalPadding = 0;
      eachColorFrame.itemSpacing = 15;
      eachColorFrame.layoutAlign = "CENTER";
      eachColorFrame.counterAxisAlignItems = "CENTER";

      const colorNode = figma.createEllipse();

      const baseColorRgb = hexToRgb(item.colorCode);
      const deltaR = (255 - baseColorRgb.r) / steps;
      const deltaG = (255 - baseColorRgb.g) / steps;
      const deltaB = (255 - baseColorRgb.b) / steps;

      // console.log(item);

      colorNode.name = `${item.colorName}-${100 - i * 10}`;
      // colorNode.opacity = (100 - i * 10) / 100;
      const currentR = Math.min(255, baseColorRgb.r + deltaR * i);
      const currentG = Math.min(255, baseColorRgb.g + deltaG * i);
      const currentB = Math.min(255, baseColorRgb.b + deltaB * i);

      colorNode.fills = [
        {
          type: "SOLID",
          color: {
            r: currentR / 255,
            g: currentG / 255,
            b: currentB / 255,
          },
        },
      ];

      const hexCode = rgbToHex(
        Math.floor(currentR),
        Math.floor(currentG),
        Math.floor(currentB)
      );

      const colorCode = figma.createText();
      const loadFontAndSetText = () => {
        colorCode.fontName = { family: "Inter", style: "Regular" };
        colorCode.characters = hexCode; // Memasukkan nilai warna
        colorCode.textAlignHorizontal = "CENTER";
        colorCode.textCase = "UPPER";
        colorCode.fontSize = 18;
        colorCode.fills = [
          {
            type: "SOLID",
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
          },
        ];
        // console.log("capung");
        // console.log(colorCode);
        // figma.currentPage.appendChild(colorCode);
      };

      // Memanggil fungsi untuk memuat font dan mengatur teks
      loadFontAndSetText();

      eachColorFrame.appendChild(colorNode);
      eachColorFrame.appendChild(colorCode);

      // Add the node to each frame
      colorFrame.appendChild(eachColorFrame);
    }

    parentFrame.appendChild(colorFrame);

    const selectFrame: FrameNode[] = [];
    selectFrame.push(parentFrame);

    figma.currentPage.selection = selectFrame;
    figma.viewport.scrollAndZoomIntoView(selectFrame);
  });
};

// const generateColorsTransparent = (datas: any) => {
//   const parentFrame = figma.createFrame();
//   parentFrame.name = "Color Palletes 2";
//   parentFrame.layoutMode = "VERTICAL";
//   parentFrame.verticalPadding = 30;
//   parentFrame.horizontalPadding = 30;
//   parentFrame.itemSpacing = 32;

//   parentFrame.primaryAxisSizingMode = "AUTO";
//   parentFrame.counterAxisSizingMode = "AUTO";

//   console.log(datas.colors);
//   // const colors = datas.colors;

//   // Perbedaan rata-rata untuk masing-masing komponen warna RGB
//   const deltaR = 12.44;
//   const deltaG = 19.78;
//   const deltaB = 8.11;

//   datas?.colors.map((item: any, itemIdx: Integer) => {
//     const colorFrame = figma.createFrame();
//     colorFrame.layoutMode = "HORIZONTAL";
//     // colorFrame.fills = [
//     //   {
//     //     type: "SOLID",
//     //     color: {
//     //       r: 0,
//     //       g: 0,
//     //       b: 0,
//     //     },
//     //   },
//     // ];
//     colorFrame.name = `color-${item.colorName}`;
//     colorFrame.verticalPadding = 0;
//     colorFrame.horizontalPadding = 0;
//     colorFrame.itemSpacing = 15;
//     colorFrame.layoutSizingVertical = "HUG";

//     for (let i = 0; i < 10; i++) {
//       const eachColorFrame = figma.createFrame();
//       eachColorFrame.layoutMode = "VERTICAL";
//       eachColorFrame.name = `Setiap color`;
//       eachColorFrame.verticalPadding = 0;
//       eachColorFrame.horizontalPadding = 0;
//       eachColorFrame.itemSpacing = 15;
//       eachColorFrame.layoutAlign = "CENTER";
//       eachColorFrame.counterAxisAlignItems = "CENTER";

//       // Membuat lingkaran warna
//       const colorNode = figma.createEllipse();
//       colorNode.name = `${item.colorName}-${100 - i * 10}`;
//       colorNode.opacity = (100 - i * 10) / 100;
//       colorNode.fills = [
//         {
//           type: "SOLID",
//           color: {
//             r: hexToRgb(item.colorCode)?.r / 255,
//             g: hexToRgb(item.colorCode)?.g / 255,
//             b: hexToRgb(item.colorCode)?.b / 255,
//           },
//         },
//       ];

//       const colorCode = figma.createText();
//       const loadFontAndSetText = () => {
//         colorCode.fontName = { family: "Inter", style: "Regular" };
//         colorCode.characters = item.colorCode; // Memasukkan nilai warna
//         colorCode.textAlignHorizontal = "CENTER";
//         colorCode.fontSize = 18;
//         colorCode.fills = [
//           {
//             type: "SOLID",
//             color: {
//               r: 0,
//               g: 0,
//               b: 0,
//             },
//           },
//         ];
//         // console.log("capung");
//         // console.log(colorCode);
//         // figma.currentPage.appendChild(colorCode);
//       };

//       // Memanggil fungsi untuk memuat font dan mengatur teks
//       loadFontAndSetText();

//       eachColorFrame.appendChild(colorNode);
//       eachColorFrame.appendChild(colorCode);

//       // Add the node to each frame
//       colorFrame.appendChild(eachColorFrame);
//     }

//     parentFrame.appendChild(colorFrame);
//   });
// };

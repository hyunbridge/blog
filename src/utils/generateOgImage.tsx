import satori, { SatoriOptions } from "satori";
import { SITE } from "@config";
import { writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const fetchFonts = async () => {
    // Regular Font
    const fontFileRegular = await fetch(
        "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff"
    );

    const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

    const fontFileBold = await fetch(
        "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff"
    );
    const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer();

    return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const ogImage = (text: string) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                background: "#f5f5f5",
                color: "#c9acc"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: "1",
                    width: "100%",
                    padding: "40px",
                    justifyContent: "center"
                }}
            >
                <h1
                    style={{
                        fontSize: "60px",
                        fontWeight: "bold",
                        color: "black"
                    }}
                >
                    {text}
                </h1>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "40px",
                    borderTop: "1px solid",
                    borderColor: "#737373",
                    fontSize: "20px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <p
                        style={{
                            marginLeft: "12px",
                            fontWeight: "600"
                        }}
                    >
                        {SITE.title}
                    </p>
                </div>
                <p>by {SITE.author}</p>
            </div>
        </div>
    );
};

const options: SatoriOptions = {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: [
        {
            name: "Pretendard",
            data: fontRegular,
            weight: 400,
            style: "normal"
        },
        {
            name: "Pretendard",
            data: fontBold,
            weight: 700,
            style: "normal"
        }
    ]
};

const generateOgImage = async (mytext = SITE.title) => {
    const svg = await satori(ogImage(mytext), options);

    // render png in production mode
    if (import.meta.env.MODE === "production") {
        const resvg = new Resvg(svg);
        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        const title = mytext.replace(/\s+/g, "-").toLowerCase();

        console.info("Output PNG Image  :", `${title}.png`);

        await writeFile(`./dist/${title}.png`, pngBuffer);
    }

    return svg;
};

export default generateOgImage;

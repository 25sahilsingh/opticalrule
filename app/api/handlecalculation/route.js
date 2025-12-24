import { NextResponse } from "next/server";
const handlemirror = (pointofcontact, muirrorinfo) => {};
const degtorad = (degree) => {
  return (degree * Math.PI) / 180;
};
export const POST = async (req) => {
  const { images } = await req.json();
  let othercomponent = images.filter((img) => {
    return img.src != "c_laser2";
  });
  //

  const laser = images.filter((img) => {
    return img.src === "c_laser2";
  });

  othercomponent = othercomponent.map((e) => {
    return {
      ...e,
      updimention: [
        e.x + Math.cos(degtorad(90 - e.rotation)) * (e.height / 2),
        e.y - Math.sin(degtorad(90 - e.rotation)) * (e.height / 2),
      ],
      downdimention: [
        e.x - Math.cos(degtorad(90 - e.rotation)) * (e.height / 2),
        e.y + Math.sin(degtorad(90 - e.rotation)) * (e.height / 2),
      ],
    };
  });
  console.log("laser", laser);
  console.log(",othercomp:", othercomponent);
  const result = {
    x1: laser[0].x,
    y1: laser[0].y,
    x2: 0,
    y2: laser[0].y,
  };
  return NextResponse.json({ coodinate: result });
};

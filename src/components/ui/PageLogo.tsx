import Image from "next/image";
import logo from "../../../public/logo.png";

function PageLogo() {
  return (
    <div className="size-8 md:size-10 cursor-pointer ">
      <Image alt="page logo" src={logo} className=" inline rounded-full " />
    </div>
  );
}

export default PageLogo;

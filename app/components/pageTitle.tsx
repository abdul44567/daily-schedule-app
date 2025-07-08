// components/PageTitle.tsx
import React from "react";

type PageTitleProps = {
  text: string;
};

function PageTitle({ text }: PageTitleProps) {
  return (
    <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
      {text}
    </h1>
  );
}

export default PageTitle;

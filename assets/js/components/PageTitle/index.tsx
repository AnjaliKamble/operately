import React from 'react';

export default function PageTitle({ title, buttons }: { title: string, buttons: [JSX.Element] }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2">
        {buttons.map((button: JSX.Element) => button)}
      </div>
    </div>
  );
}

PageTitle.defaultProps = {
  buttons: []
};

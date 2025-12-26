import GridLayout, { WidthProvider, Layout } from "react-grid-layout";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface WidgetGridProps {
  layout: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
  children: React.ReactNode;
}

export default function WidgetGrid({ layout, onLayoutChange, children }: WidgetGridProps) {
  return (
    <div className="min-h-[800px] pb-24">
      <ResponsiveGridLayout
        className="layout"
        layout={layout}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={30}
        margin={[16, 16]}
        isResizable
        isDraggable
        draggableHandle=".drag-handle"
        resizeHandles={["se"]}
        compactType="vertical"
        containerPadding={[0, 0]}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  );
}

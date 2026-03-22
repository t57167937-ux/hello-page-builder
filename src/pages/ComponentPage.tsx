import { useParams } from "react-router-dom";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import ComponentPreview from "@/components/lab/ComponentPreview";

export default function ComponentPage() {
  const { componentId } = useParams<{ componentId: string }>();

  const componentName = componentId
    ? componentId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Component";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Components", href: "/" },
          { label: componentName },
        ]}
      />
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{componentName}</h1>
        <p className="text-muted-foreground">
          Explore different variants and configurations of the {componentName} component.
        </p>
      </div>

      <div className="bg-muted/20 rounded-lg overflow-hidden min-h-[600px]">
        <ComponentPreview componentId={componentId || "button"} />
      </div>
    </div>
  );
}

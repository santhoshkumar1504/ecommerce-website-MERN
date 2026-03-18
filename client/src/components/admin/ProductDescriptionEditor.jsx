import React, { useMemo, useState } from "react";

const ProductDescriptionEditor = () => {
  const [formData, setFormData] = useState({
    productName: "iPhone 15",
    shortDescription:
      "is designed for users who need **powerful performance**, **premium camera quality**, and **all-day battery life**. It offers a smooth user experience with a modern design and advanced features.",
    whyChoose:
      "This smartphone is ideal for **gaming**, **photography**, **multitasking**, and **professional use**.  \nIt delivers **fast performance**, **excellent display clarity**, and **high-quality video recording**.",
  });

  const [highlights, setHighlights] = useState([
    { title: "Display", value: "6.1-inch Super Retina XDR display" },
    { title: "Processor", value: "A16 Bionic chip" },
    { title: "Camera", value: "48MP main camera with advanced photography features" },
    { title: "Battery", value: "Long-lasting battery backup for daily use" },
    { title: "Storage", value: "128GB internal storage" },
    { title: "Build", value: "Premium aluminium and glass finish" },
  ]);

  const [specifications, setSpecifications] = useState([
    { feature: "Brand", details: "Apple" },
    { feature: "Model", details: "iPhone 15" },
    { feature: "Display Size", details: "6.1 inch" },
    { feature: "Display Type", details: "Super Retina XDR" },
    { feature: "Processor", details: "A16 Bionic" },
    { feature: "Rear Camera", details: "48MP + Ultra Wide" },
    { feature: "Front Camera", details: "12MP" },
    { feature: "Battery", details: "3349 mAh" },
    { feature: "Storage", details: "128GB" },
    { feature: "RAM", details: "6GB" },
    { feature: "Operating System", details: "iOS" },
    { feature: "Connectivity", details: "5G, Wi-Fi, Bluetooth" },
    { feature: "Charging", details: "USB Type-C" },
    { feature: "Color", details: "Black" },
  ]);

  const [importantDetails, setImportantDetails] = useState([
    "1 Year manufacturer warranty",
    "Supports fast charging",
    "5G network supported",
    "Water and dust resistant",
    "Face ID security available",
  ]);

  const [inTheBox, setInTheBox] = useState([
    "Handset",
    "USB Type-C cable",
    "SIM ejector tool",
    "User manual",
  ]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, field, value) => {
    const updated = [...highlights];
    updated[index][field] = value;
    setHighlights(updated);
  };

  const addHighlight = () => {
    setHighlights([...highlights, { title: "", value: "" }]);
  };

  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { feature: "", details: "" }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleListChange = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addListItem = (setter, list) => {
    setter([...list, ""]);
  };

  const removeListItem = (setter, list, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  const generatedTemplate = useMemo(() => {
    const validHighlights = highlights.filter(
      (item) => item.title.trim() || item.value.trim()
    );

    const validSpecifications = specifications.filter(
      (item) => item.feature.trim() || item.details.trim()
    );

    const validImportantDetails = importantDetails.filter((item) => item.trim());
    const validInTheBox = inTheBox.filter((item) => item.trim());

    const highlightsText = validHighlights
      .map((item) => `- **${item.title}:** ${item.value}`)
      .join("\n");

    const specificationsText = validSpecifications
      .map((item) => `| ${item.feature} | ${item.details} |`)
      .join("\n");

    const importantDetailsText = validImportantDetails
      .map((item) => `- **${item}**`)
      .join("\n");

    const inTheBoxText = validInTheBox
      .map((item) => `- **${item}**`)
      .join("\n");

    return `The **${formData.productName}** ${formData.shortDescription}

### Highlights

${highlightsText}

### Why choose this product?

${formData.whyChoose}

### Specifications

| Feature | Details |
|---------|---------|
${specificationsText}

### Important Details

${importantDetailsText}

### In the Box

${inTheBoxText}`;
  }, [formData, highlights, specifications, importantDetails, inTheBox]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTemplate);
      alert("Template copied successfully!");
    } catch (error) {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Product Description Editor</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Basic Details</h3>

        <label style={styles.label}>Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleBasicChange}
          style={styles.input}
        />

        <label style={styles.label}>Short Description</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleBasicChange}
          rows={5}
          style={styles.textarea}
        />

        <label style={styles.label}>Why Choose This Product?</label>
        <textarea
          name="whyChoose"
          value={formData.whyChoose}
          onChange={handleBasicChange}
          rows={5}
          style={styles.textarea}
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Highlights</h3>
        {highlights.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleHighlightChange(index, "title", e.target.value)
              }
              style={styles.smallInput}
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) =>
                handleHighlightChange(index, "value", e.target.value)
              }
              style={styles.largeInput}
            />
            <button
              type="button"
              onClick={() => removeHighlight(index)}
              style={styles.deleteBtn}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addHighlight} style={styles.addBtn}>
          Add Highlight
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Specifications</h3>
        {specifications.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              type="text"
              placeholder="Feature"
              value={item.feature}
              onChange={(e) =>
                handleSpecificationChange(index, "feature", e.target.value)
              }
              style={styles.smallInput}
            />
            <input
              type="text"
              placeholder="Details"
              value={item.details}
              onChange={(e) =>
                handleSpecificationChange(index, "details", e.target.value)
              }
              style={styles.largeInput}
            />
            <button
              type="button"
              onClick={() => removeSpecification(index)}
              style={styles.deleteBtn}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSpecification} style={styles.addBtn}>
          Add Specification
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Important Details</h3>
        {importantDetails.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              type="text"
              placeholder="Important detail"
              value={item}
              onChange={(e) =>
                handleListChange(setImportantDetails, importantDetails, index, e.target.value)
              }
              style={styles.fullInput}
            />
            <button
              type="button"
              onClick={() =>
                removeListItem(setImportantDetails, importantDetails, index)
              }
              style={styles.deleteBtn}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setImportantDetails, importantDetails)}
          style={styles.addBtn}
        >
          Add Important Detail
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>In the Box</h3>
        {inTheBox.map((item, index) => (
          <div key={index} style={styles.row}>
            <input
              type="text"
              placeholder="Box item"
              value={item}
              onChange={(e) =>
                handleListChange(setInTheBox, inTheBox, index, e.target.value)
              }
              style={styles.fullInput}
            />
            <button
              type="button"
              onClick={() => removeListItem(setInTheBox, inTheBox, index)}
              style={styles.deleteBtn}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setInTheBox, inTheBox)}
          style={styles.addBtn}
        >
          Add Box Item
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Generated Template</h3>
        <textarea
          value={generatedTemplate}
          readOnly
          rows={22}
          style={styles.output}
        />
        <button type="button" onClick={copyToClipboard} style={styles.copyBtn}>
          Copy Template
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "1100px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#222",
  },
  section: {
    marginBottom: "28px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa",
  },
  sectionTitle: {
    marginBottom: "14px",
    color: "#111827",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    marginTop: "10px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    marginBottom: "10px",
    resize: "vertical",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  smallInput: {
    flex: "1 1 220px",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
  },
  largeInput: {
    flex: "2 1 380px",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
  },
  fullInput: {
    flex: "1 1 500px",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
  },
  addBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    marginTop: "8px",
  },
  deleteBtn: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },
  copyBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    marginTop: "12px",
  },
  output: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    resize: "vertical",
    fontFamily: "monospace",
  },
};

export default ProductDescriptionEditor;
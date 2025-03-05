import { useState } from "react";
import styles from './PdfForm.module.css'; // Importa el archivo CSS Module

function PdfForm() {
  const [formData, setFormData] = useState({
    personalData: {
      name: "",
      address: "",
      phone_number: "",
      email: "",
      date_of_birth: "",
      gender: "",
      nationality: "",
      driving_license: "",
    },
    image: "",
    resumeObjetive: "",
    workExperience: [{ position: "", data: "", place: "", description: "" }],
    education: [{ data: "", title: "", place: "" }],
    skills: [{ name: "", level: "" }],
  });

  const handleChange = (e, category, index = null, field = null) => {
    if (category === "personalData") {
      setFormData({
        ...formData,
        personalData: { ...formData.personalData, [e.target.name]: e.target.value },
      });
    } else if (category === "image") {
      setFormData({ ...formData, image: e.target.value });
    } else if (category === "resumeObjetive") {
      setFormData({ ...formData, resumeObjetive: e.target.value });
    } else {
      const updatedArray = [...formData[category]];
      updatedArray[index][field] = e.target.value;
      setFormData({ ...formData, [category]: updatedArray });
    }
  };

  const addField = (category) => {
    const newElement = {
      position: "",
      data: "",
      place: "",
      description: "",
    };
    if (category === "workExperience") {
      setFormData({
        ...formData,
        workExperience: [...formData.workExperience, newElement],
      });
    } else if (category === "education") {
      setFormData({
        ...formData,
        education: [...formData.education, { data: "", title: "", place: "" }],
      });
    } else if (category === "skills") {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: "", level: "" }],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://pdf-back-production.up.railway.app/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      

      if (!response.ok) {
        throw new Error("Error al generar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>Datos Personales</h2>
      {Object.keys(formData.personalData).map((key) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={key}
          value={formData.personalData[key]}
          onChange={(e) => handleChange(e, "personalData")}
          className={styles.inputField}
        />
      ))}

      <h2 className={styles.sectionTitle}>Imagen (Base64)</h2>
      <input
        type="text"
        name="image"
        placeholder="Imagen en Base64"
        value={formData.image}
        onChange={(e) => handleChange(e, "image")}
        className={styles.inputField}
      />

      <h2 className={styles.sectionTitle}>Objetivo del CV</h2>
      <textarea
        name="resumeObjetive"
        placeholder="Objetivo"
        value={formData.resumeObjetive}
        onChange={(e) => handleChange(e, "resumeObjetive")}
        className={styles.textArea}
      />

      <h2 className={styles.sectionTitle}>Experiencia Laboral</h2>
      {formData.workExperience.map((exp, index) => (
        <div key={index}>
          {Object.keys(exp).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={exp[key]}
              onChange={(e) => handleChange(e, "workExperience", index, key)}
              className={styles.inputField}
            />
          ))}
        </div>
      ))}
      <button type="button" onClick={() => addField("workExperience")} className={styles.addButton}>
        Añadir Experiencia
      </button>

      <h2 className={styles.sectionTitle}>Educación</h2>
      {formData.education.map((edu, index) => (
        <div key={index}>
          {Object.keys(edu).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={edu[key]}
              onChange={(e) => handleChange(e, "education", index, key)}
              className={styles.inputField}
            />
          ))}
        </div>
      ))}
      <button type="button" onClick={() => addField("education")} className={styles.addButton}>
        Añadir Educación
      </button>

      <h2 className={styles.sectionTitle}>Habilidades</h2>
      {formData.skills.map((skill, index) => (
        <div key={index}>
          {Object.keys(skill).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={skill[key]}
              onChange={(e) => handleChange(e, "skills", index, key)}
              className={styles.inputField}
            />
          ))}
        </div>
      ))}
      <button type="button" onClick={() => addField("skills")} className={styles.addButton}>
        Añadir Habilidad
      </button>

      <button type="submit" className={styles.submitButton}>
        Generar PDF
      </button>
    </form>
  );
}

export default PdfForm;

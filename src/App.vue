<template>
  <div style="display: flex; flex-direction: column;">
    <label>
      Selected Template
      <select v-model="currentTemplate">
        <option v-for="template in templates" :value="template.id">
          {{
          template.name || `Untitled ${template.id}`
          }}
        </option>
      </select>
    </label>
    <label>
      Template Name
      <input v-model="templates[currentTemplate].name" />
    </label>
    <label>
      Format
      <textarea v-model="templates[currentTemplate].format"></textarea>
    </label>
    <section style="display: flex; flex-direction: column;">
      <div v-for="(variable, i) in variables" style="display: flex; flex-direction: column;">
        <label>
          Variable Name
          <input v-model="variable.name" />
        </label>
        <label>
          Variable Query
          <textarea v-model="variable.query"></textarea>
        </label>
        <button v-on:click="removeVariable(i)">Remove</button>
      </div>
    </section>

    <button v-on:click="addVariable">Add variable</button>
    <button v-on:click="addTemplate">Add template</button>
    <button
      v-on:click="deleteTemplate(currentTemplate)"
      :disabled="currentTemplate === 0"
    >Delete current template</button>
    <button v-on:click="clipIt">Clip it!</button>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data: function() {
    return {
      currentTemplate: 0,
      templates: {
        0: {
          id: 0,
          name: "",
          format: ""
        }
      },
      variables: [
        {
          name: "",
          query: ""
        }
      ]
    };
  },
  methods: {
    addTemplate: function() {
      const newId = Object.keys(this.templates).length;
      Vue.set(this.templates, newId, {
        id: newId,
        name: "",
        format: ""
      });
    },
    addVariable: function() {
      this.variables.push({ name: "", query: "" });
    },
    clipIt: function() {
      const variablesString = JSON.stringify(this.variables);
      browser.tabs.executeScript({
        code: `(function() {
      let variables = ${variablesString};
      let queryResults = variables.map((variable) => {
        return {
          result: eval(variable.query),
          name: variable.name
        };
      });

      browser.runtime.sendMessage(queryResults);
    })()`
      });
    },
    deleteTemplate: function(templateId) {
      Vue.delete(this.templates, templateId);
      this.currentTemplate = 0;
    },
    removeVariable: function(i) {
      this.variables.splice(i, 1);
    }
  },
  watch: {
    currentTemplate: function() {
      localStorage.setItem(
        "currentTemplate",
        JSON.stringify(this.currentTemplate)
      );
    },
    format: function() {
      localStorage.setItem("format", JSON.stringify(this.format));
    },
    templates: {
      handler: function() {
        localStorage.setItem("templates", JSON.stringify(this.templates));
      },
      deep: true
    },
    variables: {
      handler: function() {
        localStorage.setItem("variables", JSON.stringify(this.variables));
      },
      deep: true
    }
  },
  mounted() {
    // Initialize localStorage
    if (!localStorage.getItem("isLocalStorageInitialized")) {
      Object.keys(this.$data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(this.$data[key]));
      });

      localStorage.setItem("isLocalStorageInitialized", true);
    }

    // Initialize Vue state
    Object.keys(this.$data).forEach(key => {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue) {
        this[key] = JSON.parse(localStorageValue);
      }
    });
  }
};
</script>

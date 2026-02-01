class main {
  //#region Initialisation & Event Handling
  /**
   * Load frontmatter for the active file into memory and set the note type used by the UI.
   * Also updates the note link index so any linked note frontmatter is current.
   * @returns {Promise<void>}
   */
  async init() {
    await app.fileManager.processFrontMatter(this.currFile, (fm) => (this.fm = fm));
    this.type = this.fm.type === "Dashboard" ? this.fm.subtype : this.fm.type;
    this.updateNoteLinks();
  }

  /**
   * Build the module configuration (paths, reference folders, fields and page data) and set the current file context.
   * Loads any required runtime helpers (for example `morphdom`) if they are not already available.
   * @returns {Promise<void>}
   */
  async startup() {
    const paths = {
      NPCs: "Compendium/NPCs",
      Players: "Compendium/Players",
      Sessions: "Compendium/Sessions",
      Projects: "Compendium/Projects",
      Modifications: "Compendium/Modifications",
      Locations: "Compendium/Locations",
      Groups: "Compendium/Groups",
      Events: "Compendium/Events",
      Dashboards: "Pages",
      images: "Assets/Images",
      icons: "Assets/Icons",
      scripts: "Assets/Scripts",
      defaultImages: "Assets/Images/Default",
      database: "Assets/Link Database.md",
    };

    const referenceFolders = [paths.Events, paths.Groups, paths.Locations, paths.NPCs, paths.Players, paths.Projects];

    const fields = {
      age: { field: "age", label: "Age" },
      aliases: {
        field: "aliases",
        label: "Aliases",
        type: "list",
        placeholder: "Enter comma separated list...",
        default: [],
      },
      alignment: { field: "alignment", label: "Alignment" },
      checksRequired: {
        field: "checks_required",
        label: "Checks Required",
        type: "number",
      },
      class: { field: "class", label: "Class" },
      date: { field: "date", label: "Date" },
      description: {
        field: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter the description here...",
      },
      gender: { field: "gender", label: "Gender" },
      goals: {
        field: "goals",
        label: "Goals",
        type: "list",
        placeholder: "Enter comma separated list...",
        default: [],
      },
      locatedIn: {
        field: "located_in",
        label: "Located In",
        type: "suggestor",
        path: paths.Locations,
        filter: true,
      },
      name: { field: "name", label: "Name" },
      player: { field: "player", label: "Player" },
      population: { field: "population", label: "Population" },
      progress: {
        field: "progress",
        label: "Progress",
        type: "number",
        default: 0,
      },
      projects: {
        field: "projects",
        label: "Projects",
        type: "select",
        path: paths.Projects,
        filter: false,
        multi: true,
        default: [],
      },
      projectStatus: {
        field: "project_status",
        label: "Status",
        default: "Not Started",
      },
      race: { field: "race", label: "Race" },
      status: { field: "status", label: "Status" },
      subtype: { field: "subtype", label: "Type" },
      url: {
        field: "url",
        label: "URL",
        placeholder: "Enter your URL here...",
      },
    };

    const pageData = {
      Event: {
        sections: ["Image", "Info Table", "Aliases", "Description", "Related Notes"],
        infoTable: [fields.subtype, fields.date],
        modalFields: [fields.name, fields.aliases, fields.subtype, fields.date, fields.description],
        modalFieldsReq: [fields.name],
        yamlFields: [fields.aliases, fields.subtype, fields.date, fields.description],
      },
      Group: {
        sections: ["Image", "Info Table", "Aliases", "Description", "Goals", "Related Notes"],
        infoTable: [fields.subtype, fields.alignment, fields.status],
        modalFields: [
          fields.name,
          fields.aliases,
          fields.subtype,
          fields.alignment,
          fields.description,
          fields.goals,
          fields.status,
        ],
        modalFieldsReq: [fields.name],
        yamlFields: [fields.aliases, fields.subtype, fields.description, fields.goals, fields.alignment, fields.status],
      },
      Location: {
        sections: ["Image", "Info Table", "Aliases", "Description", "Related Notes", "Known Locations"],
        infoTable: [fields.locatedIn, fields.subtype, fields.population, fields.status],
        modalFields: [
          fields.name,
          fields.aliases,
          fields.subtype,
          fields.description,
          fields.locatedIn,
          fields.population,
          fields.status,
        ],
        modalFieldsReq: [fields.name],
        yamlFields: [
          fields.aliases,
          fields.description,
          fields.locatedIn,
          fields.subtype,
          fields.population,
          fields.status,
        ],
      },
      NPC: {
        sections: ["Image", "Info Table", "Aliases", "Description", "Related Notes"],
        infoTable: [fields.alignment, fields.class, fields.race, fields.gender, fields.age, fields.status],
        modalFields: [
          fields.name,
          fields.aliases,
          fields.alignment,
          fields.description,
          fields.class,
          fields.race,
          fields.gender,
          fields.age,
          fields.status,
        ],
        modalFieldsReq: [fields.name, fields.description],
        yamlFields: [
          fields.aliases,
          fields.description,
          fields.class,
          fields.race,
          fields.gender,
          fields.age,
          fields.alignment,
          fields.status,
        ],
      },
      Player: {
        sections: ["Image", "Info Table", "Aliases", "Related Notes", "Webview"],
        infoTable: [fields.class, fields.race, fields.gender, fields.age, fields.player, fields.status],
        webview: { label: "Character Sheet", field: fields.url },
        modalFields: [
          fields.name,
          fields.aliases,
          fields.class,
          fields.race,
          fields.gender,
          fields.age,
          fields.status,
          fields.player,
          fields.url,
        ],
        modalFieldsReq: [fields.name, fields.player],
        yamlFields: [
          fields.aliases,
          fields.class,
          fields.race,
          fields.gender,
          fields.age,
          fields.player,
          fields.status,
          fields.url,
        ],
      },
      Project: {
        sections: ["Image", "Progress", "Aliases", "Description", "Modifications", "Related Notes", "Webview"],
        webview: { label: "Homebrew Item", field: fields.url },
        modalFields: [fields.name, fields.aliases, fields.checksRequired, fields.description, fields.url],
        modalFieldsReq: [fields.name, fields.checksRequired, fields.description],
        yamlFields: [
          fields.aliases,
          fields.projectStatus,
          fields.progress,
          fields.checksRequired,
          fields.description,
          fields.url,
        ],
      },
      Modification: {
        sections: ["Progress", "Aliases", "Parent Projects", "Description"],
        modalFields: [fields.name, fields.aliases, fields.checksRequired, fields.description, fields.projects],
        modalFieldsReq: [fields.name, fields.checksRequired, fields.description, fields.projects],
        yamlFields: [
          fields.aliases,
          fields.projectStatus,
          fields.progress,
          fields.checksRequired,
          fields.description,
          fields.projects,
        ],
      },
      Session: {
        modalFields: [fields.name],
        modalFieldsReq: [fields.name],
      },
      Dashboard: {
        Index: {
          sections: ["Image", "Index"],
          indexList: ["Sessions", "Locations", "Players", "NPCs", "Groups", "Events", "Projects"],
        },
        Location: {
          sections: ["Image", "Known Locations"],
        },
        Group: {
          sections: ["Image", "Card List"],
          listPath: paths.Groups,
          listColumns: [fields.name, fields.subtype],
        },
        Player: {
          sections: ["Image", "Card List"],
          listPath: paths.Players,
          listColumns: [fields.name, fields.class, fields.race, fields.player],
        },
        Project: {
          sections: ["Image", "Card List"],
          listPath: paths.Projects,
          listColumns: [fields.name, fields.projectStatus],
          sortField: fields.projectStatus.field,
        },
        Event: {
          sections: ["Image", "Text List"],
          listPath: paths.Events,
          listColumns: [fields.name, fields.subtype, fields.date],
        },
        NPC: {
          sections: ["Image", "Text List"],
          listPath: paths.NPCs,
          listColumns: [fields.name, fields.class, fields.race],
        },
        Session: {
          sections: ["Image", "Text List"],
          listPath: paths.Sessions,
          listColumns: [fields.name],
          sortField: "title_date",
        },
      },
    };

    this.config = {};
    this.config.paths = paths;
    this.config.referenceFolders = referenceFolders;
    this.config.fields = fields;
    this.config.pageData = pageData;
    this.currFile = app.workspace.getActiveFile();

    if (!window.morphdom) {
      const code = await app.vault.adapter.read(this.config.paths.scripts + "/morphdom.js");
      eval.call(window, code);
    }
  }

  /**
   * Attach global keyboard handlers for quick actions (e.g., Ctrl+N to open the "Create New Note" modal,
   * Ctrl+R to open the create relation modal). Also listens for Escape to close any open modal.
   * @returns {Promise<void>}
   */
  async invoke() {
    document.addEventListener(`keydown`, (e) => {
      const openModal = document.querySelector(`.std-modal`);
      if (!openModal) {
        if (e.ctrlKey) {
          switch (e.key) {
            case "n":
              e.preventDefault();
              this.startup();
              this.makeModal("Create New Note", (modal) => {
                for (const folder of this.config.referenceFolders) {
                  let folderName = folder.replace("Compendium/", "");
                  if (folderName.endsWith("s")) folderName = folderName.slice(0, -1);
                  this.makeActionButton(modal, `Create New ${folderName}`, () => this.makeNewNoteModal(folderName));
                  this.makeSpacer(modal);
                }
              });
              break;
            case "r":
              e.preventDefault();
              this.startup();
              this.makeNewRelationModal();
              break;
          }
        }
      } else {
        if (e.key === "Escape") {
          this.removeAllModals();
        }
      }
    });
  }
  //#endregion

  //#region Page Builder
  /**
   * Build and render the entire note page UI for the current file. Selects the appropriate
   * page definition (PD) from configuration based on frontmatter, constructs the title bar and
   * body, invokes section renderers, and applies the DOM update via `morphdom`.
   * @returns {Promise<void>} Resolves when the page has been rendered.
   */
  async notePage() {
    await this.init();
    const PD =
      this.fm.type === "Dashboard" ? this.config.pageData["Dashboard"][this.type] : this.config.pageData[this.type];

    const page = document.querySelectorAll(`.el-pre`)[1];
    let currBase = page.querySelector(`.std-container`);
    if (!currBase) currBase = page.createDiv({ cls: `.std-container` });
    const base = createDiv({ cls: "std-container" });
    const titleBar = base.createDiv({ cls: "std-title-bar" });
    this.makePageButton(titleBar, await this.makeIcon("home"), "Index.md", "menu-btn", true);

    const titleEl = titleBar.createEl("h1", { text: this.currFile.basename });
    if (this.fm.type !== "Dashboard") {
      titleEl.classList.add("edit-btn");
      titleEl.addEventListener("click", (e) => {
        this.makeModal(
          "Change Note Name",
          (modal) => {
            const container = modal.createDiv({ cls: "modal-field" });
            const input = container.createEl("input", {
              type: "text",
              value: this.currFile.basename,
              placeholder: "Enter New Name...",
            });
            input.setAttribute(`data-field`, "name");
            input.setAttribute(`data-type`, `text`);
            input.setAttribute(`required`, true);
          },
          async (results) => {
            if (results.name === this.currFile.basename) return true;

            const sourceFolder = "Compendium/" + this.currFile.path.split("/")[1];

            if (this.getFile(`${sourceFolder}/${results.name}.md`)) {
              throw new Error("A note with this name already exists");
            }

            await app.fileManager.renameFile(this.currFile, `${sourceFolder}/${results.name}.md`);
            return true;
          },
        );
      });
    }

    this.makeActionButton(
      titleBar,
      await this.makeIcon("tools"),
      () =>
        this.makeModal("Tools / Scripts", (parent) =>
          this.makeActionButton(parent, "Convert JPG Images To PNG", () => this.convertJPGs()),
        ),
      "menu-btn",
    );

    const body = base.createDiv({ cls: "std-body" });
    this.makeSpacer(body);

    const renderers = {
      image: this.renImage.bind(this),
      infotable: this.renInfoTable.bind(this),
      aliases: this.renAliases.bind(this),
      description: this.renDescription.bind(this),
      relatednotes: this.renRelatedNotes.bind(this),
      knownlocations: this.renKnownLocations.bind(this),
      webview: this.renWebview.bind(this),
      goals: this.renGoals.bind(this),
      progress: this.renProgress.bind(this),
      parentprojects: this.renProjectParents.bind(this),
      modifications: this.renModifications.bind(this),
      index: this.renIndex.bind(this),
      cardlist: this.renCardList.bind(this),
      textlist: this.renTextList.bind(this),
    };

    for (const section of PD.sections) {
      const key = section.toLowerCase().replace(/[^a-z0-9]+/g, ``);
      const renderer = renderers[key];
      if (renderer) await renderer(PD, body);
    }

    morphdom(currBase, base);
  }
  //#endregion

  //#region Section Renderers
  /**
   * Render the Aliases section for the current note.
   * Shows existing aliases as a removable bubble list and provides a button to open a modal
   * to create a new alias.
   * @param {Object} PD - Page definition config (contains field metadata used for labels).
   * @param {HTMLElement} body - DOM container where the section should be rendered.
   * @returns {Promise<void>}
   */
  async renAliases(PD, body) {
    const remove = (value) => this.deleteValue(this.config.fields.aliases.field, value);
    const add = () => this.makeTextValueModal("Create New Alias", "alias", this.config.fields.aliases.field);

    this.makeSectionHeader(body, this.config.fields.aliases.label);
    this.makeSpacer(body);
    const container = await this.makeBubbleList(body, this.fm.aliases, remove);
    this.makeActionButton(container, await this.makeIcon("plus"), add, "inline-btn-big");
    this.makeSpacer(body);
  }

  /**
   * Render the Description section: displays a textarea bound to the note's description frontmatter.
   * The textarea updates frontmatter on change so the description remains in sync with the file.
   * @param {Object} PD - Page definition config (contains field metadata used for labels).
   * @param {HTMLElement} body - DOM container where the section should be rendered.
   * @returns {Promise<void>}
   */
  async renDescription(PD, body) {
    this.makeSectionHeader(body, this.config.fields.description.label);
    this.makeSpacer(body);
    this.makeYamlInput(body, this.config.fields.description, "std-textarea");
    this.makeSpacer(body);
  }

  /**
   * Render a list of notes as info cards.
   * Each card shows an image, open button, and a small info table generated from PD.listColumns.
   * @param {Object} PD - Page definition config (expects listPath and listColumns properties).
   * @param {HTMLElement} body - DOM container where the card list will be appended.
   * @returns {Promise<void>}
   */
  async renCardList(PD, body) {
    this.makeSectionHeader(body, `Known ${this.type}s`);
    this.makeSpacer(body);
    this.makeActionButton(body, `Create New ${this.type}`, () => this.makeNewNoteModal(this.type));
    this.makeSpacer(body);

    const notes = this.sortValues(this.getChildren(PD.listPath), PD.sortField);
    const headers = PD.listColumns.map((c) => c.label);
    for (const note of notes) {
      const nfm = this.getFM(note);
      const data = [PD.listColumns.map((c) => (c.field === "name" ? note.basename : nfm[c.field]))];

      const container = body.createDiv({ cls: "std-info-card" });
      this.makeImage(container, nfm.type, note.basename);

      const infoBox = container.createDiv();
      this.makeSpacer(infoBox);
      this.makePageButton(infoBox, `Open ${note.basename}`, note.path);
      this.makeSpacer(infoBox);
      this.makeTable(infoBox, headers, data);
      this.makeSpacer(body);
    }
  }

  /**
   * Render the Goals section: shows current goals as removable bubbles and a button to add a goal.
   * The remove callback deletes the goal from the frontmatter and refreshes the view.
   * @param {Object} PD - Page definition config (contains field metadata used for labels).
   * @param {HTMLElement} body - DOM container where the section should be rendered.
   * @returns {Promise<void>}
   */
  async renGoals(PD, body) {
    const remove = (value) => this.deleteValue(this.config.fields.goals.field, value, true);
    const add = () => this.makeTextValueModal("Create New Goal", "goal", this.config.fields.goals.field);

    this.makeSectionHeader(body, this.config.fields.goals.label);
    this.makeSpacer(body);
    const container = await this.makeBubbleList(body, this.fm.goals, remove);
    this.makeActionButton(container, await this.makeIcon("plus"), add, "inline-btn-big");
    this.makeSpacer(body);
  }

  /**
   * Render the primary image for the note. Attempts to find a type/name specific image in
   * configured image locations and displays it; clicking opens a modal with the image.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where the image should be placed.
   * @returns {Promise<void>}
   */
  async renImage(PD, body) {
    this.makeImage(body, this.fm.type, this.currFile.basename, "std-image");
    this.makeSpacer(body);
  }

  /**
   * Render a set of dashboard index links showing counts for each configured section.
   * Uses PD.indexList to determine which sections to show and creates a card with counts and link.
   * @param {Object} PD - Page definition config (expects an indexList array).
   * @param {HTMLElement} body - DOM container where index items are rendered.
   * @returns {Promise<void>}
   */
  async renIndex(PD, body) {
    const sections = PD.indexList;
    for (const section of sections) {
      const count = this.getFile(this.config.paths[section]).children.length || 0;
      this.makeSectionHeader(body, `${section} Dashboard`);
      this.makeSubHeader(body, `${count} ${section} Found!`);
      this.makeSpacer(body);
      this.makePageButton(body, section, `Pages/${section} Dashboard.md`, "green-btn wide-btn");
      this.makeSpacer(body);
    }
  }

  /**
   * Render a compact information table for the note using PD.infoTable definitions.
   * Each cell contains a YAML-bound input (created by `makeYamlInput`) so changes update frontmatter.
   * @param {Object} PD - Page definition config (expects an infoTable array of field defs).
   * @param {HTMLElement} body - DOM container where the table will be inserted.
   * @returns {Promise<void>}
   */
  async renInfoTable(PD, body) {
    const headers = PD.infoTable.map((f) => f.label);
    let data = [[]];
    for (let field of PD.infoTable) {
      data[0].push(this.makeYamlInput(null, field));
    }
    this.makeSectionHeader(body, `${this.type} Information`);
    this.makeTable(body, headers, data);
  }

  /**
   * Render the Known Locations section as a nested details tree.
   * Builds a hierarchical view of locations based on located_in relationships and allows quick navigation.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where the location tree will be rendered.
   * @returns {Promise<void>}
   */
  async renKnownLocations(PD, body) {
    this.makeSectionHeader(body, "Known Locations");
    this.makeSpacer(body);
    this.makeActionButton(body, `Create New Location`, () => this.makeNewNoteModal(`Location`));
    const container = body.createDiv({ cls: "std-details" });
    const allLocations = this.sortValues(this.getChildren(this.config.paths.Locations));

    const renderTree = (nodes, parentEl, depth = 0) => {
      if (!nodes?.length) return;
      nodes = nodes.sort((a, b) => a.name.localeCompare(b.name));
      for (const node of nodes) {
        const item = this.makeDetailsView(parentEl, this.makeLink(node.file.path, node.name, "no-bg"), depth);
        renderTree(node.children, item, depth + 1);
      }
    };

    const filter = this.fm.type === "Dashboard" ? null : this.currFile.path;
    renderTree(this.getLocationHierarchy(allLocations, filter), container);
  }

  /**
   * Render Modifications associated with the current project.
   * Lists relevant modifications and provides controls to adjust progress and required checks.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where modifications list will be rendered.
   * @returns {Promise<void>}
   */
  async renModifications(PD, body) {
    this.makeSectionHeader(body, "Modifications");
    this.makeSpacer(body);
    this.makeActionButton(body, `Create New Modification`, () => this.makeNewNoteModal("Modification"));
    this.makeSpacer(body);

    let modifications = this.sortValues(
      this.getChildren(this.config.paths.Modifications).filter((f) => {
        const fm = this.getFM(f);
        return fm.projects.includes(this.convertToTag(this.currFile.path));
      }),
    );

    if (modifications.length != 0) {
      const headers = ["Name", "Progress", "Increase", "Decrease", "Required Checks"];

      for (const mod of modifications) {
        const fm = this.getFM(mod);

        const container = body.createDiv({
          cls: `mod-container th-${fm.project_status.toLowerCase().replace(" ", "-")}`,
        });
        await this.makeActionButton(
          container,
          await this.makeIcon("minus"),
          () => {
            this.updateProjectProgress("-", mod.path);
          },
          "red-btn no-pad",
        );
        container.createEl("p", { text: fm.progress });
        container.appendChild(this.makeLink(mod.path, mod.basename));
        container.createEl("p", { text: fm.checks_required });
        await this.makeActionButton(
          container,
          await this.makeIcon("plus"),
          () => this.updateProjectProgress("+", mod.path),
          "green-btn no-pad",
        );

        this.makeSpacer(body);
      }
    }
  }

  /**
   * Render the Progress control area for a project or modification.
   * Shows buttons to increment/decrement progress, numeric inputs bound to frontmatter for
   * progress and required checks, and a visual progress bar when applicable.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where the progress controls will be added.
   * @returns {Promise<void>}
   */
  async renProgress(PD, body) {
    this.makeSectionHeader(body, "Progress");
    this.makeSpacer(body);

    const container = body.createDiv({ cls: "std-progress" });
    this.makeActionButton(
      container,
      await this.makeIcon("minus"),
      () => this.updateProjectProgress("-"),
      "red-btn no-pad",
    );

    this.makeYamlInput(container, this.config.fields.progress);

    if (this.fm.project_status === "Completed") this.makeInlineHeader(container, "Completed", "green-heading");
    if (this.fm.project_status === "Cancelled") this.makeInlineHeader(container, "Cancelled", "red-heading");
    if (this.fm.project_status === "In Progress" || this.fm.project_status === "Not Started") {
      const progressContainer = container.createDiv({ cls: "std-progress-bar" });
      const progressBar = progressContainer.createDiv();
      progressBar.style.width = (this.fm.progress / this.fm.checks_required) * 100 + `%`;
    }

    this.makeYamlInput(container, this.config.fields.checksRequired);

    this.makeActionButton(
      container,
      await this.makeIcon("plus"),
      () => this.updateProjectProgress("+"),
      "green-btn no-pad",
    );

    this.makeSpacer(body);
  }

  /**
   * Render the Parent Projects section for a modification or project.
   * Shows current parent project links as a bubble list and provides a select modal to add parents.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where the parent list will be rendered.
   * @returns {Promise<void>}
   */
  async renProjectParents(PD, body) {
    const remove = (value) => this.deleteValue("projects", value);
    const add = () => {
      const files = this.sortValues(this.getChildren(this.config.paths.Projects));
      const options = files
        .map((file) => {
          return [file.basename, this.convertToTag(file.path)];
        })
        .filter((o) => !this.fm.projects.includes(o[1]));

      this.makeSelectValueModal("Add Parent Project", "project", this.config.fields.projects.field, options);
    };

    this.makeSectionHeader(body, "Parent Projects");
    this.makeSpacer(body);
    const links = [];
    for (let path of this.fm.projects) {
      const basename = this.getFile(this.convertToLink(path)).basename;
      links.push(this.makeLink(path, basename));
    }
    const container = await this.makeBubbleList(body, links, remove);
    this.makeActionButton(container, await this.makeIcon("plus"), add, "inline-btn-big");
    this.makeSpacer(body);
  }

  /**
   * Render groups of related notes extracted from frontmatter (keys starting with `linked_`).
   * For each relationship group, show a titled subsection and a bubble list of links with remove actions.
   * @param {Object} PD - Page definition config (not directly used but provided for consistency).
   * @param {HTMLElement} body - DOM container where related note groups will be rendered.
   * @returns {Promise<void>}
   */
  async renRelatedNotes(PD, body) {
    const remove = (path) => this.removeNoteLinks(path);
    const add = () => this.makeNewRelationModal();

    this.makeSectionHeader(body, "Related Notes");
    this.makeSpacer(body);
    this.makeActionButton(body, "Add New Relation", add);
    this.makeSpacer(body);

    const linkGroups = {};
    for (const key in this.fm) {
      if (key.startsWith("linked_")) linkGroups[key] = this.fm[key];
    }

    if (Object.keys(linkGroups).length === 0) return;

    for (let groupKey in linkGroups) {
      const groupName = this.titleCase(groupKey.replace("linked_", ""));
      const title = `Related ${groupName}`;
      this.makeSubHeader(body, title);

      const linksOriginal = linkGroups[groupKey];
      let links = [];
      for (let link of linksOriginal) {
        link = this.convertToLink(link);
        links.push(this.makeLink(link, this.getFile(link).basename));
      }

      links = this.sortValues(links);

      this.makeSpacer(body);
      await this.makeBubbleList(body, links, remove);
      this.makeSpacer(body);
    }
  }

  /**
   * Render a simple textual list of related notes using PD.listColumns as the columns.
   * Each row includes an 'Open' button and the configured columns pulled from frontmatter.
   * @param {Object} PD - Page definition config (expects listPath and listColumns properties).
   * @param {HTMLElement} body - DOM container where the text list will be placed.
   * @returns {Promise<void>}
   */
  async renTextList(PD, body) {
    this.makeSectionHeader(body, `Known ${this.type}s`);
    this.makeSpacer(body);
    this.makeActionButton(body, `Create New ${this.type}`, () => this.makeNewNoteModal(this.type));
    this.makeSpacer(body);

    const notes = this.sortValues(this.getChildren(PD.listPath), PD.sortField);
    const headers = [...["Open"], ...PD.listColumns.map((c) => c.label)];
    const data = [];
    for (const note of notes) {
      const nfm = this.getFM(note);
      const row = [
        ...[this.makePageButton(undefined, "Open", note.path)],
        ...PD.listColumns.map((c) => (c.field === "name" ? note.basename : nfm[c.field])),
      ];
      data.push(row);
    }

    this.makeTable(body, headers, data);
    this.makeSpacer(body);
  }

  /**
   * Render a webview sub-section: shows an editable URL input bound to frontmatter and
   * displays a `<webview>` element when a URL is present. A refresh button updates the view.
   * @param {Object} PD - Page definition config (expects webview:{label, field}).
   * @param {HTMLElement} body - DOM container where the webview will be rendered.
   * @returns {Promise<void>}
   */
  async renWebview(PD, body) {
    this.makeSectionHeader(body, PD.webview.label);
    const container = body.createDiv({ cls: "std-webview" });
    container.setAttribute("skip", this.skipWebviewReload);
    const urlInput = container.createDiv();
    this.makeInlineHeader(urlInput, "URL:");
    this.makeYamlInput(urlInput, PD.webview.field);
    this.makeActionButton(urlInput, "Refresh", () => this.refreshView());
    if (this.hasValue("url", this.fm)) {
      container.createEl("webview", { attr: { src: this.fm.url } });
    }
    this.makeSpacer(body);
  }
  //#endregion

  //#region Basic Dom Elements
  /**
   * Create a simple spacer element used to add vertical spacing between UI blocks.
   * @param {HTMLElement} parent - Parent element to which the spacer will be appended.
   * @returns {HTMLElement} The created spacer element.
   */
  makeSpacer(parent) {
    return parent.createDiv({ cls: "std-spacer" });
  }

  /**
   * Create an inline section header (H4) used for labeling small fields or controls.
   * @param {HTMLElement} parent - Parent element to which the header will be appended.
   * @param {string} header - Text content for the header.
   * @param {string} [cls] - Optional CSS class(es) to apply to the header.
   * @returns {HTMLElement} The created H4 element.
   */
  makeInlineHeader(parent, header, cls = "") {
    return parent.createEl("h4", { text: header, cls: cls });
  }

  /**
   * Create a main section header (H2) used to label major page sections.
   * @param {HTMLElement} parent - Parent element to which the header will be appended.
   * @param {string} header - Text content for the header.
   * @param {string} [cls] - Optional CSS class(es) to apply to the header.
   * @returns {HTMLElement} The created H2 element.
   */
  makeSectionHeader(parent, header, cls = "") {
    return parent.createEl("h2", { text: header, cls: cls });
  }

  /**
   * Create a sub-section header (H3) used for grouping related content within a section.
   * @param {HTMLElement} parent - Parent element to which the sub-header will be appended.
   * @param {string} header - Text content for the sub-header.
   * @param {string} [cls] - Optional CSS class(es) to apply to the sub-header.
   * @returns {HTMLElement} The created H3 element.
   */
  makeSubHeader(parent, header, cls = "") {
    return parent.createEl("h3", { text: header, cls: cls });
  }

  /**
   * Load an SVG icon from the configured icons folder and return an element containing it.
   * Reads the SVG file from vault and injects the content into an `<i>` element.
   * @param {string} iconName - Base name of the icon file (without .svg extension).
   * @param {string} [cls] - Optional CSS class(es) to apply to the icon element.
   * @returns {Promise<HTMLElement>} A promise that resolves to the icon element containing the SVG.
   */
  async makeIcon(iconName, cls = "") {
    const path = this.config.paths.icons + `/${iconName}.svg`;
    const content = await app.vault.adapter.read(path);
    const icon = createEl("i", { cls: cls + " std-icon" });
    icon.innerHTML = content;
    return icon;
  }

  /**
   * Attempt to locate and display an image for the provided type and name.
   * Tries a sequence of configured image paths, and when found creates an `<img>` element added to `parent`.
   * Clicking the image opens a modal showing the full-size image.
   * @param {HTMLElement} parent - Parent element to which the image will be appended.
   * @param {string} type - The object type (used to construct image file paths, e.g., "NPC").
   * @param {string} name - The name used to construct the image filename.
   * @param {string} [cls] - Optional CSS class(es) to apply to the image element.
   * @returns {(HTMLElement|false)} The created image element if found; otherwise `false` if no image was located.
   */
  makeImage(parent, type, name, cls = "") {
    const options = [
      `${this.config.paths.images}/${type} - ${name}.png`,
      `${this.config.paths.defaultImages}/${type} - Template.png`,
      `${this.config.paths.defaultImages}/${type} - ${name}.png`,
    ];

    let imgPath;
    for (const option of options) {
      if (!imgPath && this.getFile(option)) {
        imgPath = app.vault.adapter.getResourcePath(option);
      }
    }

    if (!imgPath) return false;

    const img = parent.createEl("img", { attr: { src: imgPath, class: cls } });
    img.addEventListener("click", (e) => {
      if (e.target === img)
        this.makeModal(name, (modal) => modal.createEl("img", { attr: { src: imgPath, class: "std-modal-image" } }));
    });
    return img;
  }
  //#endregion

  //#region Interactive Dom Elements
  /**
   * Create a clickable action button and attach the given callback.
   * The provided callback may be async and receives the click event.
   * @param {HTMLElement|null} parent - Parent element to append the button to; if null the button is created detached.
   * @param {string} label - The text content for the button.
   * @param {(ev:Event)=>void|Promise<void>} script - Callback invoked when the button is clicked.
   * @param {string} [cls="green-btn"] - Optional CSS class(es) to apply.
   * @returns {HTMLElement} The created button element.
   */
  makeActionButton(parent, label, script, cls = "green-btn") {
    let btn;
    if (parent) btn = parent.createEl("button", { text: label, cls: cls + " std-button" });
    if (!parent) btn = createEl("button", { text: label, cls: cls + " std-button" });

    btn.addEventListener("click", async (ev) => {
      await script(ev);
    });

    return btn;
  }

  /**
   * Create an anchor styled as a page button that links to an internal note path.
   * @param {HTMLElement|null} parent - Parent element to append the anchor to; if null the element is returned detached.
   * @param {string} label - Link text for the button.
   * @param {string} link - Internal link target, e.g., "Pages/Index.md".
   * @param {string} [cls="green-btn"] - Optional CSS class(es) to apply.
   * @returns {HTMLElement} The created anchor element.
   */
  makePageButton(parent, label, link, cls = "green-btn") {
    let btn;
    if (parent) btn = parent.createEl("a", { text: label, href: link, cls: cls + " std-button internal-link" });
    if (!parent) btn = createEl("a", { text: label, href: link, cls: cls + " std-button internal-link" });
    return btn;
  }

  /**
   * Create a simple anchor element used for internal note links.
   * @param {string} link - The path or tag to link to (e.g., "Compendium/Players/Cassiel.md" or "[[Cassiel]]").
   * @param {string} label - Display text for the link.
   * @param {string} [cls] - Optional CSS class(es) to apply.
   * @returns {HTMLElement} The created anchor element.
   */
  makeLink(link, label, cls = "") {
    return createEl("a", { text: label, href: link, cls: cls + " internal-link" });
  }

  /**
   * Create a collapsible <details> element pre-opened with a summary and return the content area.
   * Useful for rendering hierarchical or expandable lists where the caller will add child nodes to the returned area.
   * @param {HTMLElement} parent - Parent element to which the details element is appended.
   * @param {string|HTMLElement} header - Text for the summary or an element to be used as the summary.
   * @param {number} [depth=0] - Depth used to set a CSS variable for styling nested indent levels.
   * @param {string|null} [content=null] - Optional initial text content for the content area.
   * @param {string} [cls] - Optional CSS class(es) to apply to the details element.
   * @returns {HTMLElement} The content area element (a div) inside the details element where children should be appended.
   */
  makeDetailsView(parent, header, depth = 0, content = null, cls = "") {
    const container = parent.createEl("details", { cls: cls });
    container.style.setProperty("--depth", depth);
    container.open = true;
    container.createEl("summary", { text: header });
    const contentArea = container.createDiv({ text: content });
    return contentArea;
  }

  /**
   * Create a simple table element with the given headers and data.
   * `data` is an array of rows, where each row is an array of cell values or DOM nodes.
   * If `equalSize` is true a CSS property will be set to help style columns evenly.
   * @param {HTMLElement} parent - Parent element to which the table will be appended.
   * @param {string[]} [headers=[]] - Array of header labels.
   * @param {Array<Array<string|HTMLElement>>} [data=[[]]] - Table data as rows of cell values or nodes.
   * @param {boolean} [equalSize=true] - If true, headers will receive a CSS property for equal sizing.
   * @param {string} [cls] - Optional CSS class(es) to apply to the table.
   * @returns {{table:HTMLElement, hr:HTMLElement}} An object containing the table element and the header row element.
   */
  makeTable(parent, headers = [], data = [[]], equalSize = true, cls = "") {
    const table = parent.createEl("table", { cls: cls + " std-table" });
    const hr = table.createEl("tr", { cls: "std-table-hr" });

    for (const header of headers) {
      const th = hr.createEl("th", { text: header });
      if (equalSize) th.style.setProperty("--col-count", headers.length);
    }

    for (const row of data) {
      const tr = table.createEl("tr");
      for (const d of row) {
        tr.createEl("td", { text: d });
      }
    }

    return { table, hr };
  }

  /**
   * Create an input control bound to a YAML/frontmatter field.
   * Supports `select`, `textarea`, `number`, and plain `text` types as defined by `field.type`.
   * On change the value is written back to the active file's frontmatter (numbers converted to integers).
   * @param {HTMLElement|null} parent - Parent element to append the input to; if null a detached container is created.
   * @param {{field:string,label?:string,type?:string,placeholder?:string,path?:string,filter?:boolean}} field - Field definition from config describing the frontmatter key and input type.
   * @param {string} [cls="std-input"] - Optional CSS class(es) for the container.
   * @returns {HTMLElement} The container element that contains the input control.
   */
  makeYamlInput(parent, field, cls = "std-input") {
    const fieldKey = field.field;
    const fmValue = this.fm[fieldKey];
    const type = field.type ? field.type : "text";
    const placeholder = field.placeholder ? field.placeholder : "-";
    const inputContainer = parent ? parent.createDiv({ cls: cls }) : createDiv({ cls: cls });
    let input;
    let notes;

    switch (type) {
      case "suggestor":
        let tempValue = fmValue;
        if (fieldKey === "located_in" && tempValue) {
          tempValue = tempValue
            .replace(/\[\[|\]\]/g, "")
            .replace(".md", "")
            .split("/")[2];
        }

        input = inputContainer.createEl("input", {
          type: "text",
          value: tempValue,
          placeholder: placeholder,
          attr: { list: `${fieldKey}-list` },
        });
        const datalist = inputContainer.createEl("datalist", { attr: { id: `${fieldKey}-list` } });
        notes = this.getChildren(field.path);

        if (field.filter && field.field === "located_in") {
          notes = this.getLocationHierarchy(notes, this.currFile.path, false);
        }

        for (const note of notes) {
          datalist.createEl("option", { text: note.basename });
        }

        notes = notes.map((n) => n.path);
        break;

      case "textarea":
        input = inputContainer.createEl("textarea");
        input.value = fmValue;
        input.placeholder = placeholder;
        break;

      default:
        input = inputContainer.createEl("input", { type: type, value: fmValue, placeholder: placeholder });
    }

    input.addEventListener("change", (ev) => {
      if (this.fm[fieldKey] !== ev.target.value) {
        let newValue = typeof this.fm[fieldKey] === "number" ? +ev.target.value : ev.target.value;

        if (fieldKey === "located_in" && newValue != "") {
          newValue = this.convertToLink(["Locations", newValue]);

          input.classList.remove("input-error");
          if (!notes.includes(newValue)) {
            input.classList.add("input-error");
            return;
          }

          newValue = this.convertToTag(newValue);
        }

        app.fileManager.processFrontMatter(this.currFile, (fm) => {
          fm[fieldKey] = newValue;
        });
      }
    });

    return inputContainer;
  }

  /**
   * Render a list of items as removable "bubbles" and attach an action to each remove control.
   * Useful for displaying tags, aliases, or lists of links where each item can be removed.
   * @param {HTMLElement} parent - Parent element to which the bubble list will be appended.
   * @param {Array<string|HTMLElement>} values - Values or nodes to be shown as bubbles.
   * @param {(value: any)=>void|Promise<void>} xAction - Callback invoked when the remove control is clicked for an item.
   * @returns {Promise<HTMLElement>} The container element for the bubble list.
   */
  async makeBubbleList(parent, values, xAction) {
    const container = parent.createDiv({ cls: "std-bubble-list" });

    for (let value of values) {
      const linkContainer = container.createDiv({ text: value });
      await this.makeActionButton(linkContainer, await this.makeIcon("close"), () => xAction(value), "inline-btn");
    }
    return container;
  }
  //#endregion

  //#region Composite / Complex Dom Elements
  /**
   * Render a modal dialog with a title and provided content callback. If an `action` function is supplied,
   * a Submit button is added which validates inputs (elements within the modal having `data-field`) and
   * collects their values into a results object before invoking the action. Input values are coerced based on
   * their `data-type` attribute (list, select, number, checkbox) — numbers are parsed to integers.
   * The modal displays inline validation and error messages provided by the action or from validation.
   * @param {string} title - Modal title shown in the header.
   * @param {(parent:HTMLElement)=>void} content - Callback used to populate the modal body. Receives the modal body element.
   * @param {(results:Object)=>boolean|Promise<boolean>} [action=null] - Optional submit callback. If it resolves/returns a truthy value the modal will close.
   * @returns {Promise<void>}
   */
  async makeModal(title, content, action = null) {
    this.removeAllModals();
    const page = document.querySelector(`.app-container`);
    const modal = page.createDiv({ cls: "std-modal" });
    modal.addEventListener("click", (e) => (e.target === modal ? modal.remove() : null));
    const base = modal.createDiv();
    const titleDiv = base.createDiv({ cls: "title-container" });
    titleDiv.createEl("h1", { text: title });
    this.makeActionButton(titleDiv, await this.makeIcon("close_circle"), () => modal.remove(), "");
    const body = base.createDiv({ cls: "body" });
    this.makeSpacer(body);
    const errorArea = body.createDiv({ cls: "modal-error-area" });

    content(body);

    if (action) {
      this.makeSpacer(body);
      this.makeActionButton(base.createDiv(), "Submit", async () => {
        errorArea.innerHTML = "";
        let results = {};
        let valid = true;
        let errors = [];
        const inputs = document.querySelectorAll(".std-modal [data-field]");
        for (const input of inputs) {
          input.classList.remove("input-error");
          if (input.required && !input.value.trim()) {
            input.classList.add("input-error");
            errors.push(`${input.previousElementSibling?.textContent || "Field"} is required`);
            valid = false;
          } else {
            const inputType = input.getAttribute(`data-type`);
            let value = input.value;
            if (inputType === "list" && input.value) {
              value = input.value.split(",").map((v) => v.trim());
            } else if (inputType === "select" && input.multiple) {
              value = Array.from(input.selectedOptions).map((opt) => opt.value);
            } else if (inputType === "number") {
              value = parseInt(input.value);
            } else if (inputType === "checkbox") {
              value = input.checked;
            }
            results[input.getAttribute(`data-field`)] = value;
          }
        }

        if (errors.length > 0) {
          for (const error of errors) {
            const errorDiv = errorArea.createDiv({ cls: "modal-error-message" });
            errorDiv.createEl("span", { text: error });
            this.makeSpacer(errorArea);
          }
        }

        if (valid) {
          try {
            const output = await action(results);
            if (output) {
              this.removeAllModals();
              return output;
            }
          } catch (error) {
            const errorDiv = errorArea.createDiv({ cls: "modal-error-message" });
            errorDiv.createEl("span", { text: error.message || "An unexpected error occurred" });
            this.makeSpacer(errorArea);
          }
        }
      });
    }
  }

  /**
   * Create and show the "Create New <type>" modal using field definitions from `config.pageData[type]`.
   * The modal automatically builds inputs for each field (number, textarea, select, text) and handles validation for required fields.
   * On submit it creates a new note file using a dataviewjs template, populates frontmatter fields based on the modal inputs,
   * optionally opens the newly created note and can insert a link into the active editor.
   * @param {string} type - The type of note to create (e.g., "Session", "NPC").
   * @returns {void}
   */
  makeNewNoteModal(type) {
    let notes;

    this.makeModal(
      `Create New ${type}`,
      (modal) => {
        for (const field of this.config.pageData[type].modalFields) {
          const fieldType = field.type ? field.type : "text";
          const required = this.config.pageData[type].modalFieldsReq.some((f) => f.field === field.field);
          const multi = field.multi ? true : false;
          const placeholder = field.placeholder ? field.placeholder : "-";
          const container = modal.createDiv({ cls: "modal-field" });
          this.makeInlineHeader(container, field.label);
          let input;

          if (fieldType === "number") {
            input = container.createEl("input", { type: "number", placeholder: placeholder });
          } else if (fieldType === "textarea") {
            input = container.createEl("textarea");
            input.placeholder = placeholder;
          } else if (fieldType === "select") {
            input = container.createEl("select");
            input.createEl("option", { text: "-", value: "" });
            notes = this.sortValues(this.getChildren(field.path));

            notes.forEach((opt) => {
              const name = opt.basename;
              const optPath = this.convertToTag(opt.path);
              const optionEl = input.createEl("option", { text: name, value: optPath });
              if (opt.path === this.currFile.path) optionEl.selected = true;
            });

            if (multi) {
              input.multiple = true;
              input.size = input.options.length;
            }
          } else if (fieldType === "suggestor") {
            input = container.createEl("input", {
              type: "text",
              placeholder: placeholder,
              attr: { list: `${field.field}-list-modal` },
            });
            const datalist = container.createEl("datalist", { attr: { id: `${field.field}-list-modal` } });
            notes = this.getChildren(field.path);
            for (const note of notes) {
              datalist.createEl("option", { text: note.basename });
              if (note.path === this.currFile.path) {
                input.value = note.basename;
              }
            }
          } else {
            input = container.createEl("input", { type: "text", placeholder: placeholder });
            if (type === "Session" && field.field === "name") {
              const now = new Date();
              const dateNow = [
                String(now.getDate()).padStart(2, "0"),
                String(now.getMonth() + 1).padStart(2, "0"),
                now.getFullYear(),
              ].join("-");
              input.value = dateNow;
            }
          }

          if (required) input.setAttribute(`required`, true);
          input.setAttribute(`data-field`, field.field);
          input.setAttribute(`data-type`, fieldType);
        }

        const openCont = modal.createDiv({ cls: "modal-field-checkbox" });
        this.makeInlineHeader(openCont, "Open Note?");
        const openNow = openCont.createEl("input", { type: "checkbox" });
        openNow.setAttribute(`data-field`, `open_now`);
        openNow.setAttribute(`data-type`, `checkbox`);

        if (this.currFile.path.startsWith(this.config.paths.Sessions)) {
          const addLinkCont = modal.createDiv({ cls: "modal-field-checkbox" });
          this.makeInlineHeader(addLinkCont, "Insert Link?");
          const addLink = addLinkCont.createEl("input", { type: "checkbox" });
          addLink.setAttribute(`data-field`, "add_link");
          addLink.setAttribute(`data-type`, `checkbox`);
        }
      },
      async (results) => {
        results.name = this.titleCase(results.name);
        const code = `\`\`\`dataviewjs\nconst {main} = await cJS();\nawait main.startup();\nmain.notePage();\n\`\`\``;
        const filePath = this.config.paths[`${type}s`] + `/${results.name}.md`;
        const hasYamlFields = this.config.pageData[type]["yamlFields"];
        if (this.getFile(filePath)) {
          throw new Error("A note with this name already exists");
        }
        if (results["located_in"]) {
          if (!notes.includes(this.convertToLink(["Locations", results["located_in"]]))) {
            throw new Error("Location provided does not exist!");
          }
        }

        const note = await app.vault.create(filePath, hasYamlFields ? code : "");
        await app.fileManager.processFrontMatter(note, (fm) => {
          fm.type = type;
          if (this.config.pageData[type]["yamlFields"]) {
            for (const field of this.config.pageData[type].yamlFields) {
              const defaultValue = field.hasOwnProperty(`default`) ? field.default : null;
              let newValue = results[field.field] ? results[field.field] : defaultValue;

              if (field.field === "located_in") {
                if (newValue !== "") {
                  newValue = this.convertToTag(["Locations", newValue]);
                }
              }
              fm[field.field] = newValue;
            }
          }
        });

        if (results.open_now) {
          const leaf = app.workspace.getLeaf(true);
          await leaf.openFile(note);
        }

        if (results.add_link) {
          const leaf = app.workspace.activeLeaf;
          if (!leaf || !leaf.view || !leaf.view.editor) return;
          const editor = leaf.view.editor;
          const link = this.convertToTag(filePath);
          editor.replaceRange(link, editor.getCursor());
          editor.setCursor({ line: editor.getCursor().line, ch: editor.getCursor().ch + link.length });
        }

        this.notify(`${results.name} Created!`);

        return true;
      },
    );
  }

  /**
   * Present a modal for creating a new relation between two existing notes.
   * Allows entering a note to be linked to the currently open note.
   * Validates that the selected notes are not identical and delegates to `addNoteLinks` to persist the relation.
   * @returns {void}
   */
  makeNewRelationModal() {
    let links;

    this.makeModal(
      "Create New Link",
      async (modal) => {
        const container = modal.createDiv({ cls: "modal-field" });
        this.makeInlineHeader(container, "Related Note");
        links = Object.values(await this.getNoteLinks()).flatMap((arr) => arr.map(this.convertToLink, this));
        let notes = this.config.referenceFolders
          .flatMap((folder) => this.getChildren(folder))
          .filter((n) => {
            if (n.path === this.currFile.path || links.includes(n.path)) {
              return false;
            }
            return true;
          });

        const input = container.createEl("input", { type: "text", placeholder: "-", attr: { list: "list" } });
        input.setAttribute(`data-field`, `input`);
        input.setAttribute(`required`, true);

        const list = container.createEl("datalist", { attr: { id: "list" } });
        for (const note of notes) {
          list.createEl("option", { text: `${note.parent.name} - ${note.basename}` });
        }
      },
      async (results) => {
        let link;
        try {
          link = this.convertToLink(results.input.split("-").map((s) => s.trim()));
        } catch {
          throw new Error("Invalid Note, please try again.");
        }

        const success = await this.addNoteLinks(link);
        if (!success) {
          throw new Error("Link already exists between these notes");
        }
        return true;
      },
    );
  }

  /**
   * Show a modal containing a select input with provided options and write the selected value to frontmatter.
   * Typically used to add a single YAML value from a precomputed set of options.
   * @param {string} title - Title for the modal dialog.
   * @param {string} name - The data-field name used to read the selected value in the submit handler.
   * @param {string} field - The frontmatter field key to set with the selected value.
   * @param {Array<[string, string]>} options - Array of [label, value] pairs to populate the select.
   * @returns {void}
   */
  makeSelectValueModal(title, name, field, options) {
    this.makeModal(
      title,
      (modal) => {
        const container = modal.createDiv({ cls: "modal-field" });
        const input = container.createEl("select");
        for (const option of options) {
          input.createEl("option", { text: option[0], value: option[1] });
        }
        input.setAttribute(`data-field`, name);
        input.setAttribute(`data-type`, `text`);
        input.setAttribute(`required`, true);
      },
      async (results) => {
        await this.setValue(field, results[name], false);
        return true;
      },
    );
  }

  /**
   * Show a modal with a single text input, validate uniqueness against an array field and add the value to frontmatter.
   * Useful for creating new simple named elements (aliases, goals, etc.) where the list field should not contain duplicates.
   * @param {string} title - Modal title.
   * @param {string} name - The data-field key used in the modal for the input value.
   * @param {string} field - The frontmatter array field to which the value will be appended.
   * @returns {void}
   */
  makeTextValueModal(title, name, field) {
    this.makeModal(
      title,
      (modal) => {
        const container = modal.createDiv({ cls: "modal-field" });
        const input = container.createEl("input", { type: "text", placeholder: `Enter ${name} here...` });
        input.setAttribute(`data-field`, name);
        input.setAttribute(`data-type`, `text`);
        input.setAttribute(`required`, true);
      },
      (results) => {
        if (this.fm[field].includes(results[name])) {
          throw new Error(`${name} already exists`);
        }
        this.setValue(field, results[name], false);
        return true;
      },
    );
  }
  //#endregion

  //#region Frontmatter & Vault Utilities
  /**
   * Resolve an abstract file by path from the vault.
   * @param {string} path - The vault-relative path to the file (e.g., "Compendium/Players/Cassiel.md").
   * @returns {import('obsidian').TAbstractFile|undefined} The file object, or undefined when not found.
   */
  getFile(path) {
    if (!path) return;
    return app.vault.getAbstractFileByPath(path);
  }

  /**
   * Return the immediate children files for a folder path or file object.
   * Accepts either a string path or a file-like object with a `path` property.
   * @param {string|object} input - Path string or file object whose children should be returned.
   * @returns {Array<import('obsidian').TFile>} Array of child files (empty array if none).
   */
  getChildren(input) {
    if (typeof input !== "string") input = input.path;
    const file = this.getFile(input);
    if (!file?.children) return [];
    return Array.from(file.children);
  }

  /**
   * Retrieve frontmatter for a file or path.
   * @param {import('obsidian').TFile|string} file - A file object or a path string; returns {} if file is not found.
   * @returns {Object} The frontmatter object for the specified file (or an empty object).
   */
  getFM(file) {
    if (typeof file === "string") file = this.getFile(file);
    if (!file) return {};
    return app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  }

  /**
   * Check whether a frontmatter field has a value (non-null, non-empty-string).
   * @param {string} field - The frontmatter key to check.
   * @param {Object|null} [fmOverride=null] - Optional frontmatter object to check instead of the currently loaded file.
   * @returns {boolean} True when the field exists and is not empty/null.
   */
  hasValue(field, fmOverride = null) {
    const fm = fmOverride ? fmOverride : this.fm;
    return fm[field] !== undefined && fm[field] !== null && fm[field] !== "";
  }

  /**
   * Set a frontmatter field on the current file. Handles both scalar and array frontmatter fields.
   * - If the target field is an array and `override` is true, the array is replaced; otherwise the new value is appended.
   * - For non-array fields, `override` controls whether the value is concatenated onto the existing value (string) or replaced.
   * @param {string} field - Frontmatter field name to set.
   * @param {*} value - Value to write into the field (string, number, array, etc.).
   * @param {boolean} [override=true] - When true replace the field value; when false append/merge where appropriate.
   * @param {boolean} [refresh=true] - When true call `refreshView()` after updating frontmatter.
   * @returns {Promise<void>}
   */
  async setValue(field, value, override = true, refresh = true) {
    await app.fileManager.processFrontMatter(this.currFile, (fm) => {
      if (Array.isArray(fm[field])) {
        if (override) {
          fm[field] = value;
        } else {
          Array.isArray(value) ? (fm[field] = fm[field].concat(value)) : fm[field].push(value);
        }
      } else {
        fm[field] = override ? fm[field] + value : value;
      }
    });
    if (refresh) this.refreshView();
  }

  /**
   * Remove a value from a frontmatter array, or nullify a scalar field.
   * @param {string} field - Frontmatter field name to modify.
   * @param {*} value - For array fields the value to remove; ignored for scalar fields which are set to null.
   * @param {boolean} [refresh=true] - When true call `refreshView()` after updating frontmatter.
   * @returns {Promise<void>}
   */
  async deleteValue(field, value, refresh = true) {
    await app.fileManager.processFrontMatter(this.currFile, (fm) => {
      if (Array.isArray(fm[field])) {
        fm[field].splice(fm[field].indexOf(value), 1);
      } else {
        fm[field] = null;
      }
    });
    if (refresh) this.refreshView();
  }

  /**
   * Refresh the current rendered view by rebuilding the note page.
   * @returns {Promise<void>}
   */
  async refreshView() {
    this.notePage();
  }

  /**
   * Sort an array of file-like or link-like entries. Handles special cases:
   * - If items are link objects (contain `href` property) they are sorted by `display`.
   * - If `sortField` is `project_status` a custom ordering is applied (In Progress, Not Started, Completed, Cancelled).
   * - Otherwise sorts by the provided `sortField` string on the items.
   * @param {Array} values - Array of items to sort (files, link objects, etc.).
   * @param {string} [sortField="basename"] - Field name used for sorting when applicable.
   * @returns {Array} The sorted array.
   */
  sortValues(values, sortField = "basename") {
    if (!values.length) return values;
    if ("href" in values[0]) return values.sort((a, b) => a["href"].localeCompare(b["href"]));
    if (sortField === "title_date") {
      return values.sort((a, b) => {
        let dateComps = [a.basename, b.basename];
        dateComps.forEach((dc, i) => {
          dateComps[i] = dc.split(" ").reverse().join("-");
        });

        return dateComps[1].localeCompare(dateComps[0]);
      });
    } else if (sortField === "project_status") {
      const statusOrder = ["In Progress", "Not Started", "Completed", "Cancelled"];
      const grouped = statusOrder.map((status) =>
        values.filter((f) => this.getFM(f)[sortField] === status).sort((a, b) => a.basename.localeCompare(b.basename)),
      );
      return grouped.flat();
    } else {
      return values.sort((a, b) => a[sortField].localeCompare(b[sortField]));
    }
  }
  //#endregion

  //#region String / Text Utilities
  /**
   * Convert a Dataview-style tag or link like `[[Name]]` into a vault file path (appends `.md`).
   * Example: `[[Location/City]]` -> `Location/City.md`
   * @param {string} tag - Tag or link string that may contain `[[` and `]]`.
   * @returns {string} The corresponding file path with `.md` suffix.
   */
  convertToLink(tag) {
    if (Array.isArray(tag)) {
      return `Compendium/${tag.join("/")}.md`;
    }

    return tag.replace(/\[\[|\]\]/g, "") + ".md";
  }

  /**
   * Convert a file path (or filename) into a Dataview-style tag `[[Name]]`.
   * Example: `Location/City.md` -> `[[Location/City]]`
   * @param {string} link - File path or filename (may include `.md`).
   * @returns {string} The corresponding tag string wrapped in `[[` and `]]`.
   */
  convertToTag(link) {
    if (Array.isArray(link)) {
      link = `Compendium/${link.join("/")}.md`;
    }

    return `[[${link.replace(".md", "")}]]`;
  }

  /**
   * Convert a string into title case for display (split on spaces, underscores and hyphens,
   * lowercases the input then capitalizes the first letter of each word).
   * Example: `hill_giant` -> `Hill Giant`.
   * @param {string} str - Input string to convert.
   * @returns {string} Title-cased string, or empty string when input is falsy.
   */
  titleCase(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  //#endregion

  //#region UI Helpers / Notification Utilities
  /**
   * Show a transient notification (Obsidian Notice) to the user.
   * @param {string|any} message - Message text shown in the notice; non-string values will be stringified.
   * @param {number} [timeout=3000] - Duration in milliseconds before the notice disappears.
   */
  notify(message, timeout = 3000) {
    new Notice(String(message), timeout);
  }

  /**
   * Remove any open standard modals from the DOM.
   * @returns {void}
   */
  removeAllModals() {
    const openModals = document.querySelectorAll(`.std-modal`);
    for (const modal of openModals) modal.remove();
  }
  //#endregion

  //#region Database Utilities
  /**
   * Add a bidirectional link between two notes in the link database.
   * Normalises inputs into canonical tag pairs, ensures there are no duplicates and persists the updated DB.
   * @param {string|object} pathA - Path string or link object for first note (can be a file object or an obsidian href).
   * @param {string|object} [pathB=this.currFile.path] - Path string or link object for second note (defaults to current file path).
   * @returns {Promise<boolean>} True when the link was added; false when the link already existed or inputs were invalid.
   */
  async addNoteLinks(pathA, pathB = this.currFile.path) {
    const db = await this.loadDB();
    const pair = this.normalisePair(pathA, pathB);
    if (pair[0] === pair[1]) return false;
    const exists = db.some((e) => e[0] === pair[0] && e[1] === pair[1]);
    if (exists) return false;

    db.push(pair);
    await this.saveDB(db);
    return true;
  }

  /**
   * Retrieve related note links for a target note from the link database and group them by type.
   * Converts the target path into a tag form, collects matching pairs, maps folder names to friendly types
   * (e.g., "players"/"npcs" → "characters"), sorts each group by basename and returns an ordered object.
   * @param {string} [targetPath=this.currFile.path] - Path of the note to look up (string or path-like); defaults to current file.
   * @returns {Promise<Object>} An object whose keys are lowercased types and values are arrays of tag strings.
   */
  async getNoteLinks(targetPath = this.currFile.path) {
    const db = await this.loadDB();
    targetPath = this.convertToTag(targetPath);
    const results = {};
    for (const [a, b] of db) {
      const match = a === targetPath ? b : b === targetPath ? a : null;
      if (!match) continue;
      let type = match.split("/")[1].toLowerCase();
      if (type === "players" || type === "npcs") type = "characters";
      if (!results[type]) results[type] = [];
      results[type].push(match);
    }

    for (const type in results) {
      results[type].sort((x, y) => {
        const nameX = x.split("/")[2];
        const nameY = y.split("/")[2];
        return nameX.localeCompare(nameY);
      });
    }

    const sorted = Object.fromEntries(Object.entries(results).sort(([a], [b]) => a.localeCompare(b)));
    return sorted;
  }

  /**
   * Load the JSON link database from the configured database file path and parse it.
   * @returns {Promise<Array>} Parsed array of link pairs stored in the DB file.
   * @throws Will propagate errors from vault read or JSON parsing.
   */
  async loadDB() {
    let file = null;
    if (this.getFile(this.config.paths.database)) {
      file = this.getFile(this.config.paths.database);
    } else {
      file = await app.vault.create(this.config.paths.database, "[]");
    }
    let content = await app.vault.read(file);
    return JSON.parse(content);
  }

  /**
   * Normalise two inputs into a sorted pair of tag strings used in the DB.
   * Supports strings and objects containing `href` (obsidian link) or `path` properties; converts to Dataview tag form `[[path]]` and sorts the pair to create a canonical order.
   * Returns `null` when inputs are invalid or identical.
   * @param {string|object} inputA - Path string or object for first note.
   * @param {string|object} inputB - Path string or object for second note.
   * @returns {(Array|null)} Sorted pair of tag strings or null when inputs are invalid.
   */
  normalisePair(inputA, inputB) {
    if (!inputA || !inputB || inputA === inputB) return null;
    if (typeof inputA === "object")
      inputA = inputA.href ? inputA.href.replace("app://obsidian.md/", "").replace(/%20/g, " ") : inputA.path;
    if (typeof inputB === "object")
      inputB = inputB.href ? inputB.href.replace("app://obsidian.md/", "").replace(/%20/g, " ") : inputB.path;
    inputA = this.convertToTag(inputA);
    inputB = this.convertToTag(inputB);
    return [inputA, inputB].sort();
  }

  /**
   * Remove a link pair from the database if present.
   * @param {string|object} pathA - Path or link-like object for the first note of the pair.
   * @param {string|object} [pathB=this.currFile.path] - Path or link-like object for the second note of the pair.
   * @returns {Promise<boolean>} True when removed, false when the pair did not exist.
   */
  async removeNoteLinks(pathA, pathB = this.currFile.path) {
    const db = await this.loadDB();
    const pair = this.normalisePair(pathA, pathB);
    const exists = db.some((e) => e[0] === pair[0] && e[1] === pair[1]);
    if (!exists) return false;
    const index = db.findIndex((e) => e[0] === pair[0] && e[1] === pair[1]);
    db.splice(index, 1);
    await this.saveDB(db);

    this.notify("Link Removed");
    return true;
  }

  /**
   * Persist the link database to the configured file path, then update all linked frontmatter and refresh the view.
   * @param {Array} db - The database array to write.
   * @returns {Promise<void>}
   */
  async saveDB(db) {
    const file = this.getFile(this.config.paths.database);
    const content = JSON.stringify(db, null, 2);
    await app.vault.modify(file, content);
    await this.updateNoteLinks();
    this.refreshView();
    return;
  }

  /**
   * Update the frontmatter of a target file to reflect the current link database.
   * Removes any `linked_*` keys and re-populates them from the DB for the given target.
   * @param {import('obsidian').TFile|string} [target=this.currFile] - File object or path to update.
   * @returns {Promise<void>}
   */
  async updateNoteLinks(target = this.currFile) {
    if (typeof target === "string") target = this.getFile(target);
    const links = await this.getNoteLinks(target.path);
    await app.fileManager.processFrontMatter(target, (fm) => {
      for (const key in fm) {
        if (key.split("_")[0] === "linked") {
          delete fm[key];
        }
      }
      for (const key in links) {
        fm[`linked_${key}`] = links[key];
      }
    });
  }
  //#endregion

  //#region Page Specific Utilities
  /**
   * Build a location hierarchy from a list of location files, using each file's `located_in` frontmatter to
   * determine parent/child relationships. Returns either a tree of nodes suitable for nested rendering or a
   * flat sorted list of files excluding the current file and any descendants of a provided root.
   * @param {Array<import('obsidian').TFile>} files - Array of location files to analyze.
   * @param {string|null} filterRootPath - If provided, used to limit output to the descendants of this path (in link/tag form or path form expected to match file.path).
   * @param {boolean} [asTree=true] - When true returns a tree structure of nodes {file,name,children}; when false returns a flat array of files.
   * @returns {Array} Either an array of node objects (when asTree=true) or an array of file objects (when asTree=false).
   */
  getLocationHierarchy(files, filterRootPath, asTree = true) {
    const parentMap = {};
    const nodeMap = {};
    files.forEach((file) => {
      const fm = this.getFM(file);
      const parent = fm.located_in ? this.convertToLink(fm.located_in) : null;
      parentMap[file.path] = parent;
      nodeMap[file.path] = { file, name: file.basename, children: [] };
    });

    Object.entries(parentMap).forEach(([child, parent]) => {
      if (parent && nodeMap[parent]) nodeMap[parent].children.push(nodeMap[child]);
    });

    const descendants = new Set();
    if (filterRootPath) {
      function findDescendants(path) {
        for (const [child, parent] of Object.entries(parentMap)) {
          if (parent === path && !descendants.has(child)) {
            descendants.add(child);
            findDescendants(child);
          }
        }
      }
      findDescendants(filterRootPath);
    }

    if (asTree) {
      if (filterRootPath) {
        return this.sortValues(nodeMap[filterRootPath]?.children ?? [], "name");
      } else {
        return Object.values(nodeMap).filter((node) => {
          const parent = parentMap[node.file.path];
          return !parent || !nodeMap[parent];
        });
      }
    } else {
      return this.sortValues(files.filter((file) => file.path !== this.currFile.path && !descendants.has(file.path)));
    }
  }

  /**
   * Adjust a project's progress counter and update its `project_status` accordingly.
   * The function accepts an action (+ or -) to increment/decrement the `progress` value, ensures
   * `checks_required` and `progress` defaults, computes a status (Completed/In Progress/Cancelled/Not Started)
   * and writes the updated frontmatter. Optionally refreshes the view when the target is the current file or
   * when `refresh` is true.
   * @param {'+'|'-'} action - '+' to increment progress, '-' to decrement progress.
   * @param {import('obsidian').TFile|string} [target=this.currFile] - The file object or path to operate on (defaults to the active file).
   * @param {boolean} [refresh=true] - Whether to refresh the view after updating (ignored if target is the current file, in which case view is refreshed).
   * @returns {Promise<void>}
   */
  async updateProjectProgress(action, target = this.currFile, refresh = true) {
    if (typeof target === "string") target = this.getFile(target);
    let newStatus = null;

    await app.fileManager.processFrontMatter(target, (fm) => {
      fm.progress ??= 0;
      fm.checks_required ??= 0;
      const oldStatus = fm.project_status;

      if (action === "+" && fm.progress < fm.checks_required) {
        fm.progress++;
        fm.project_status = "In Progress";
      } else if (action === "-" && fm.progress > -1) {
        fm.progress--;
        fm.project_status = "In Progress";
      }

      newStatus = (() => {
        if (fm.progress >= fm.checks_required) return "Completed";
        if (fm.progress > 0) return "In Progress";
        if (fm.progress < 0) return "Cancelled";
        return "Not Started";
      })();

      fm.project_status = newStatus;
    });

    if (target === this.currFile || refresh) this.refreshView();
  }
  //#endregion

  //#region Tools / Utility Scripts
  /**
   * Convert all JPEG/JPG images in the vault to PNG format.
   * For each JPEG found this function:
   *  - reads the binary content
   *  - decodes it into an Image and draws it to a canvas
   *  - generates a PNG blob and writes it back to the vault with the same path and a `.png` extension
   *  - deletes the original JPEG file
   * Shows a notice with the number of images converted. Errors are logged to console and conversion continues.
   * @returns {Promise<void>} Resolves when conversion has finished for all discovered files.
   */
  async convertJPGs() {
    const jpgFiles = app.vault.getFiles().filter((f) => /jpe?g$/i.test(f.extension));

    let converted = 0;
    if (jpgFiles.length > 0) {
      for (const file of jpgFiles) {
        try {
          const buffer = await app.vault.readBinary(file);
          const imgUrl = URL.createObjectURL(new Blob([buffer], { type: "image/jpeg" }));
          const img = new Image();
          img.src = imgUrl;
          await img.decode();
          URL.revokeObjectURL(imgUrl);

          const canvas = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
          if (!pngBlob) continue;

          const newPath = file.path.replace(/\.jpe?g$/i, ".png");
          await app.vault.createBinary(newPath, await pngBlob.arrayBuffer());
          await app.vault.delete(file);
          converted++;
        } catch (e) {
          console.warn("Error converting image", file.path, e);
        }
      }
    }

    this.notify(`${converted} Images Converted`);

    return;
  }
  //#endregion
}

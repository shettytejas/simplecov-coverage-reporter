const path = require("path");
const mdTable = require("markdown-table");
const fs = require("fs");

class Content {
  static DECIMAL_PLACES = 2;

  static HEADER_KEYS = undefined;
  static HEADER_VALUES = undefined;
  static TOTAL_HEADER = undefined;
  static CONCLUSION_STRING = undefined;

  static builder(workspace, core) {
    const json = JSON.parse(
      fs.readFileSync(path.resolve(workspace, core.coverageFilePath))
    );
    return json.meta.config
      ? new AdvancedContent(json, core)
      : new SimpleContent(json, core);
  }

  // Variables
  #json;
  #customisations;
  #groups;

  constructor(json, core) {
    this.#json = json;
    this.#customisations = core.customisations;

    this.#groups = this.json.groups;
  }

  // Getters

  get groups() {
    return this.#groups;
  }

  get json() {
    return this.#json;
  }

  get title() {
    return this.#customisations.title;
  }

  // Helpers

  formattedGroups() {
    return Object.entries(this.groups).map(([key, value]) =>
      this.constructor.collector([key], value.lines)
    );
  }

  summary() {
    return `## ${this.title}
${this.tableString()}
${this.conclusion()}`;
  }

  tableString() {
    return mdTable([
      this.constructor.HEADER_VALUES,
      ...this.formattedGroups(),
      this.formattedTotal(),
    ]);
  }

  // TODO: This is a tech-debt and I shouldn't be depending on array's ordering.
  // TODO: Replace this in future updates.
  lastFromTotal() {
    return this.formattedTotal()[this.formattedTotal().length - 1];
  }

  static collector(array, object) {
    this.HEADER_KEYS.forEach((key) => {
      let val = object[key];

      if (val === undefined) return;
      if (key.includes("percent"))
        val = val.toFixed(Content.DECIMAL_PLACES) + "%";

      array.push(val);
    });

    return array;
  }
}

class AdvancedContent extends Content {
  static HEADER_KEYS = [
    "group_name",
    "covered_lines",
    "missed_lines",
    "lines_of_code",
    "covered_percent",
  ];
  static HEADER_VALUES = [
    "Group Name",
    "Covered Lines",
    "Missed Lines",
    "Lines of Code",
    "Covered Percent",
  ];
  static TOTAL_HEADER = "**TOTAL**";

  // Variables
  #config;
  #formattedTotal;
  #errors;

  constructor(json, core) {
    super(json, core);

    this.#errors = this.json.errors;
    this.#config = this.json.meta.config;
  }

  conclusion() {
    const total = this.lastFromTotal();
    const icon =
      parseFloat(total.replace("%", "")) > this.#config.minimum_coverage
        ? "🎉"
        : "❌";

    return `#### Your total coverage is ${total} ${icon}`;
  }

  formattedErrors() {
    // TODO: Tech debt. Use array#any? alternative once we add more errors.
    const errorsByFile = this.formatMinimumCoverageByFileErrors();
    if (!errorsByFile) return "";

    return `### Errors
${errorsByFile}`;
  }

  formattedTotal() {
    return (this.#formattedTotal ||= this.constructor.collector(
      [this.constructor.TOTAL_HEADER],
      this.json.total
    ));
  }

  summary() {
    const errors = this.formattedErrors();
    const result = super.summary();

    if (!errors) return result;

    return result + "\n" + errors;
  }

  // ERROR HELPERS

  formatMinimumCoverageByFileErrors() {
    if (Object.keys(this.#errors.less_than_minimum_coverage).length === 0)
      return "";

    return `#### Files that failed to pass minimum coverage:
${Object.entries(this.#errors.less_than_minimum_coverage)
  .map(([key, value]) => `- ${key}: ${value.toFixed(2)}%`)
  .join("\n")}`;
  }
}

class SimpleContent extends Content {
  static HEADER_KEYS = ["group_name", "covered_percent"];
  static HEADER_VALUES = ["Group Name", "Covered Percent"];
  static TOTAL_HEADER = "**AVERAGE**";

  #formattedTotal;

  constructor(json, core) {
    super(json, core);
  }

  conclusion() {
    const average = this.lastFromTotal();

    return `#### Your average coverage across all groups is ${average} 🎉`;
  }

  formattedTotal() {
    if (this.#formattedTotal) return this.#formattedTotal;

    const array = [this.constructor.TOTAL_HEADER];
    let avg = 0,
      count = 0;

    Object.values(this.groups).forEach((value) => {
      count++;
      avg += value.lines.covered_percent;
    });

    array.push((avg / count).toFixed(Content.DECIMAL_PLACES) + "%");

    return (this.#formattedTotal = array);
  }
}

module.exports = (workspacePath, core) => Content.builder(workspacePath, core);
module.exports.super = Content;

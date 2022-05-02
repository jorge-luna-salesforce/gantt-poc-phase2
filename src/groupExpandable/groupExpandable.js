import { api, LightningElement } from "lwc";

export default class GroupExpandable extends LightningElement {
  @api group;

  expanded = this.group?.expanded ? "utility:chevronup" : "utility:chevrondown";

  constructor() {
    super();
  }

  handleClick() {
    this.expanded = this.expanded === "utility:chevrondown" ? "utility:chevronup" : "utility:chevrondown";
    this.dispatchEvent(new CustomEvent("groupclick", { detail: this.group }));
  }
}

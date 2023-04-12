const fs = require("fs");

module.exports = class Container {
  constructor(fileName) {
    this.fileRoute = `./${fileName}.txt`;
    this.contID = 1;
  }

  async save(obj) {
    try {
      let text = "";
      if (!fs.existsSync(this.fileRoute)) {
        obj.id = this.contID;
        text = JSON.stringify([obj]);
      } else {
        const content = await this.getAll();
        if (content.length > 0) {
          this.contID = content[content.length - 1].id + 1;
        } else {
          this.contID = 1;
        }
        obj.id = this.contID;
        text = JSON.stringify([...content, obj]);
      }
      await fs.promises.writeFile(this.fileRoute, text);
      return obj.id;
    } catch (error) {
      throw new Error(
        `Error writing OBJECT: ${JSON.stringify(obj)} to FILE: ${
          this.fileRoute
        } \n\t More info: ${error.message}`
      );
    }
  }

  async getById(id) {
    try {
      const content = await this.getAll();
      if (content.length > 0) {
        const obj = content.find((obj) => obj.id === id);
        if (obj) return obj;
      }
      throw new Error(
        `Not found object with ID: ${id} in FILE: ${this.fileRoute}`
      );
    } catch (error) {
      throw new Error(
        `Error getting object with ID: ${id} from FILE: ${this.fileRoute} \n\t More info: ${error.message}`
      );
    }
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.fileRoute))
        throw new Error(
          `Cannot read FILE: ${this.fileRoute} because it does not exist`
        );
      const content = await fs.promises.readFile(this.fileRoute, "utf-8");
      if (!content.length > 0) {
        await fs.promises.writeFile(this.fileRoute, "[]");
      } else {
        const array = JSON.parse(content);
        return array;
      }
      return [];
    } catch (error) {
      throw new Error(
        `Error reading FILE: ${this.fileRoute} \n\t More info: ${error.message}`
      );
    }
  }

  async deleteById(id) {
    try {
      if (!fs.existsSync(this.fileRoute)) {
        throw new Error(
          `Cannot delete object with ID: ${id} from FILE: ${this.fileRoute} because it does not exist`
        );
      } else {
        const content = await this.getAll();
        if (content.length > 0) {
          const index = content.findIndex((obj) => obj.id === id);
          if (index === -1) {
            throw new Error(
              `Cannot delete object with ID: ${id} because it does not exist in FILE: ${this.fileRoute}`
            );
          } else {
            content.splice(index, 1);
            const text = JSON.stringify(content);
            await fs.promises.writeFile(this.fileRoute, text);
          }
        }
      }
    } catch (error) {
      throw new Error(
        `Error deleting object with ID: ${id} from FILE: ${this.fileRoute} \n\t More info: ${error.message}`
      );
    }
  }

  async deleteAll() {
    try {
      if (!fs.existsSync(this.fileRoute)) {
        throw new Error(
          `Cannot clean up FILE: ${this.fileRoute} because it does not exist`
        );
      } else {
        await fs.promises.writeFile(this.fileRoute, "");
        console.log(`Cleaned up FILE: ${this.fileRoute}`);
      }
    } catch (error) {
      throw new Error(
        `Error cleaning FILE: ${this.fileRoute} \n\t More info: ${error.message}`
      );
    }
  }
};
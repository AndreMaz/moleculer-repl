const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require("../../usage/help")
const kleur 			= require("kleur");

const subCommandOpt = subcommand([
    stringPos('serviceName', { desc: "Name of the service to destroy", descArg: 'serviceName', required: true } ),
    stringPos('version', { desc: "Name of the service to destroy", descArg: 'version'} ),
    flag("help", ["--help"], { desc: "Output usage information" })
]);

async function handler(broker, cmd, args, errs) {
    const serviceName = args.serviceName;
    const version = args.version;

    const service = broker.getLocalService(serviceName, version);

    if (!service) {
        console.warn(kleur.red(`Service "${serviceName}" doesn't exists!`));
        return;
    }

    const p = broker.destroyService(service);
    console.log(kleur.yellow(`>> Destroying '${serviceName}'...`));

    try {
        await p
        console.log(kleur.green(">> Destroyed successfully!"));
    } catch (error) {
        console.error(kleur.red(">> ERROR:", error.message));
        console.error(kleur.red(error.stack));
    }
}

module.exports = function (commands, broker) {
    const cmd = subCommandOpt(
		"destroy", // Name
		["destroy"], // Alias
		{
			desc: "Destroy a local service.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};

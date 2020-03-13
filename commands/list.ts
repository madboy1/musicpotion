import { Command, CommandContext } from "./Command";
import Deps from "../deps";
import { music } from "../modules/music/music";
import { VoiceChannel, Message, User } from "discord.js";

export default class PlayCommand implements Command {
    name = 'list';
    summary = 'Display the current track list.';
    cooldown = 3;
    
    execute = async(ctx: CommandContext) => {
        const { queue } = this.joinAndGetPlayer(ctx);

        let details = '';
        for (let i = 0; i < queue.length; i++) {
            const track = queue[i];
            details += (i == 0) 
                ? `**Now Playing**: \`${track.title}\` from <@!${track.requestor}>\n` 
                : `**[${i + 1}]** \`${track.title}\` from <@!${track.requestor}>`;
        }
        return ctx.channel.send(details || 'No tracks in list.');
    }

    private joinAndGetPlayer(ctx: CommandContext) {
        const voiceChannel = ctx.member.voice.channel;
        if (!voiceChannel) {
            throw new Error('You must be in a voice channel to play music.');
        }

        return music.players.spawn({
            guild: ctx.guild,
            voiceChannel: voiceChannel,
            textChannel: ctx.channel,
        });
    }
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Copy, Download, Share2, Mic, FileText, Image as ImageIcon, Wand2 } from "lucide-react";

const AIStudio = () => {
  const [inputMethod, setInputMethod] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState("english");
  const [tone, setTone] = useState("professional");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const generateStory = () => {
    if (!textInput.trim() && inputMethod === "text") {
      toast.error("Please enter some details about your craft");
      return;
    }

    setIsGenerating(true);

    // Mock AI story generation
    setTimeout(() => {
      const stories = [
        `Crafted with love and tradition, each piece tells a story of heritage passed down through generations. Our artisan ${textInput ? `specializes in ${textInput}, ` : ''}combines ancient techniques with contemporary design, creating timeless treasures that celebrate sustainable craftsmanship.`,
        `From the skilled hands of our master artisan comes this exceptional creation. ${textInput ? `Focusing on ${textInput}, ` : ''}Every detail reflects years of dedication to the craft, using eco-friendly materials sourced from local cooperatives. This piece embodies the perfect harmony between tradition and innovation.`,
        `Discover the artistry behind this unique handcrafted piece. ${textInput ? `Inspired by ${textInput}, ` : ''}Our artisan's journey began in a small village, learning age-old techniques from master craftspeople. Today, their work bridges cultural heritage with modern aesthetics, creating pieces that resonate with conscious consumers worldwide.`,
      ];

      const randomStory = stories[Math.floor(Math.random() * stories.length)];
      setGeneratedStory(randomStory);
      setIsGenerating(false);
      toast.success("Story generated successfully!");
    }, 2500);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast.success("Recording started...");
      // Mock recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setTextInput("Traditional pottery techniques with natural clay and organic glazes");
        toast.success("Recording complete! Transcription added.");
      }, 3000);
    } else {
      toast.info("Recording stopped");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory);
    toast.success("Story copied to clipboard!");
  };

  const downloadStory = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedStory], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "artisan-story.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Story downloaded!");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold">AI Storytelling Studio</h1>
                <p className="text-muted-foreground">
                  Create compelling stories for your crafts with AI
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Input Method Selection */}
              <Card className="p-6 card-glow">
                <Label className="text-lg font-semibold mb-4 block">Input Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={inputMethod === "text" ? "default" : "outline"}
                    onClick={() => setInputMethod("text")}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span>Text Input</span>
                  </Button>
                  <Button
                    variant={inputMethod === "voice" ? "default" : "outline"}
                    onClick={() => setInputMethod("voice")}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <Mic className="h-6 w-6" />
                    <span>Voice Input</span>
                  </Button>
                </div>
              </Card>

              {/* Text/Voice Input Area */}
              <Card className="p-6 card-glow">
                <Label className="text-lg font-semibold mb-4 block">
                  {inputMethod === "text" ? "Describe Your Craft" : "Voice Recording"}
                </Label>
                
                {inputMethod === "text" ? (
                  <Textarea
                    placeholder="Tell us about your craft, materials, techniques, or inspiration..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center h-48 bg-muted rounded-lg border-2 border-dashed border-border">
                      <motion.div
                        animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Button
                          size="lg"
                          onClick={handleVoiceRecording}
                          className={`rounded-full w-20 h-20 ${
                            isRecording ? "bg-destructive hover:bg-destructive/90" : "gradient-hero"
                          }`}
                        >
                          <Mic className={`h-8 w-8 ${isRecording ? "animate-pulse" : ""}`} />
                        </Button>
                      </motion.div>
                    </div>
                    
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <Badge variant="destructive" className="animate-pulse">
                          Recording in progress...
                        </Badge>
                      </motion.div>
                    )}
                    
                    {textInput && !isRecording && (
                      <Card className="p-4 bg-muted">
                        <p className="text-sm font-medium mb-1">Transcription:</p>
                        <p className="text-sm text-muted-foreground">{textInput}</p>
                      </Card>
                    )}
                  </div>
                )}
              </Card>

              {/* Story Settings */}
              <Card className="p-6 card-glow">
                <Label className="text-lg font-semibold mb-4 block">Story Settings</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="poetic">Poetic & Artistic</SelectItem>
                        <SelectItem value="marketing">Marketing & Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full gradient-hero hover-lift"
                onClick={generateStory}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                    </motion.div>
                    Generating Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Story with AI
                  </>
                )}
              </Button>
            </motion.div>

            {/* Output Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 card-glow min-h-[600px] flex flex-col">
                <Label className="text-lg font-semibold mb-4">Generated Story</Label>
                
                <AnimatePresence mode="wait">
                  {generatedStory ? (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex-1 p-6 bg-muted/30 rounded-lg border border-border mb-4">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {generatedStory}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={copyToClipboard}
                            className="hover-lift"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={downloadStory}
                            className="hover-lift"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>

                        <Button
                          className="w-full gradient-hero hover-lift"
                          onClick={() => toast.success("Story posted to Artisan Feed!")}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Post to Artisan Feed
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setGeneratedStory("")}
                        >
                          Generate New Story
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-center"
                    >
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Ready to Create Magic?
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Add your craft details and click generate to create a compelling story with AI
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Tips Card */}
              <Card className="p-6 bg-accent/5 border-accent/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Include specific details about materials and techniques</li>
                  <li>• Mention your inspiration and creative process</li>
                  <li>• Highlight sustainable or traditional aspects</li>
                  <li>• Add personal touches that make your craft unique</li>
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8 border-t border-border"
          >
            <p className="text-muted-foreground italic">
              "Let AI Tell Your Story — MingleMakers Storytelling Studio"
            </p>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AIStudio;